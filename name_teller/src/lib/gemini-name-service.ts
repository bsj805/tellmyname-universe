// src/lib/gemini-name-service.ts
import { GoogleGenAI, Type } from "@google/genai";
import { PrismaClient, SourceType } from "@prisma/client";
import {
  isValidKoreanNamePhonetics,
  runAdversarialNameAuditSubagent,
  AdversarialAuditResult,
} from "./adversarial-qc-subagent";

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratedNameMeaning {
  hangulName: string;
  primaryHanja: string;
  poeticTitle: string;
  syllableBreakdown: Array<{
    hangul: string;
    hanja: string;
    meaning: string;
    strokeCount: number;
    symbolism: string;
  }>;
  storyInterpretation: string;
  altHanjaCombos: Array<{
    hanja: string;
    reading: string;
    summary: string;
  }>;
  vibeTags: string[];
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
}

function getInitialConsonant(word: string): string {
  const CHO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const code = word.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return "ㅇ";
  return CHO[Math.floor(code / 588)] || "ㅇ";
}

/**
 * 1. DB에서 한글 이름을 먼저 조회합니다.
 * 2. DB에 없다면 [생성 에이전트]가 가장 예쁜 한자 뜻풀이를 초안 작성하고,
 *    [품질 검증 서브에이전트]가 이를 검수하여 결함 발견 시 스스로 수정(Self-Correction)한 뒤
 *    최종 통과본을 DB에 영구 저장(Upsert)합니다.
 */
export async function getOrGenerateNameMeaning(rawName: string) {
  const hangulName = rawName.trim();
  if (!isValidKoreanNamePhonetics(hangulName)) {
    throw new Error("유효한 한글 이름(1~5자 표준 음절)을 입력해주세요.");
  }

  // Step 1: DB 조회
  const existing = await prisma.nameEntry.findUnique({
    where: { hangulName },
    include: {
      messages: {
        where: { qcSafetyScore: { gte: 0.85 } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (existing) {
    await prisma.nameEntry.update({
      where: { hangulName },
      data: { searchCount: { increment: 1 } },
    });
    return { entry: existing, newlyGenerated: false };
  }

  // Step 2: 생성 에이전트 ↔ 품질 검증 서브에이전트 루프 (최대 2회 자가 교정)
  let currentDraft: GeneratedNameMeaning | null = null;
  let lastAudit: AdversarialAuditResult | null = null;
  let feedbackContext = "";

  for (let attempt = 1; attempt <= 2; attempt++) {
    const prompt = `
당신은 '이름을 설명해드립니다'의 수석 한자 이름 큐레이터(Creator Agent)입니다.
한글 이름 "${hangulName}"의 각 음절(${Array.from(hangulName).join(", ")})에 대해,
대법원 인명용 한자 중 음(소리)이 100% 일치하면서 가장 시적이고 아름다운 의미를 지닌 한자 조합과 뜻풀이를 작성하세요.
Google AdSense 고품질 콘텐츠 기준을 충족하도록 storyInterpretation은 최소 600자 이상의 따뜻하고 문학적인 에세이 형식으로 작성하고,
검색 사용자의 궁금증을 해결하는 구체적인 FAQ 3문항을 포함하세요.
${feedbackContext}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryHanja: { type: Type.STRING },
            poeticTitle: { type: Type.STRING },
            syllableBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hangul: { type: Type.STRING },
                  hanja: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  strokeCount: { type: Type.INTEGER },
                  symbolism: { type: Type.STRING },
                },
                required: ["hangul", "hanja", "meaning", "strokeCount", "symbolism"],
              },
            },
            storyInterpretation: { type: Type.STRING },
            altHanjaCombos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hanja: { type: Type.STRING },
                  reading: { type: Type.STRING },
                  summary: { type: Type.STRING },
                },
                required: ["hanja", "reading", "summary"],
              },
            },
            vibeTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            faqItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ["question", "answer"],
              },
            },
          },
          required: [
            "primaryHanja",
            "poeticTitle",
            "syllableBreakdown",
            "storyInterpretation",
            "altHanjaCombos",
            "vibeTags",
            "faqItems",
          ],
        },
      },
    });

    currentDraft = JSON.parse(response.text || "{}") as GeneratedNameMeaning;

    // 품질 검증 서브에이전트 호출!
    lastAudit = await runAdversarialNameAuditSubagent(hangulName, currentDraft);
    if (lastAudit.passed && lastAudit.totalScore >= 90) {
      break; // 품질 검증 통과!
    }

    // 반려된 경우 검증 피드백을 다음 프롬프트에 주입하여 스스로 수정(Self-Correction)
    feedbackContext = `
[⚠️ 품질 검증 서브에이전트 반려 피드백 (시도 ${attempt}차 - 점수: ${lastAudit.totalScore}점)]
- 발견된 문제점: ${lastAudit.issuesFound.join(" / ")}
- 필수 수정 지시사항: ${lastAudit.revisionInstruction}
위 지적 사항을 100% 반영하여 결함을 완전히 수정한 새 JSON을 출력하세요.
`;
  }

  if (!currentDraft) {
    throw new Error("뜻풀이 생성에 실패했습니다.");
  }

  const finalScore = lastAudit?.totalScore ?? 90;
  const isIndexable = finalScore >= 90;

  // Step 3: 검수 완료된 뜻풀이를 DB에 영구 축적 (검색 커버리지 자동 확장)
  const savedEntry = await prisma.nameEntry.upsert({
    where: { hangulName },
    update: { searchCount: { increment: 1 } },
    create: {
      hangulName,
      initialConsonant: getInitialConsonant(hangulName),
      primaryHanja: currentDraft.primaryHanja,
      poeticTitle: currentDraft.poeticTitle,
      syllableBreakdown: currentDraft.syllableBreakdown,
      storyInterpretation: currentDraft.storyInterpretation,
      altHanjaCombos: currentDraft.altHanjaCombos,
      vibeTags: currentDraft.vibeTags,
      faqItems: currentDraft.faqItems,
      sourceType: SourceType.GEMINI_GENERATED,
      qcAuditScore: finalScore,
      qcAuditLog: lastAudit ? JSON.parse(JSON.stringify(lastAudit)) : null,
      isIndexable,
      searchCount: 1,
    },
    include: { messages: true },
  });

  return { entry: savedEntry, newlyGenerated: true, auditResult: lastAudit };
}
