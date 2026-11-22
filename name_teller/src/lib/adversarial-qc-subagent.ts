// src/lib/adversarial-qc-subagent.ts
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedNameMeaning } from "@/lib/gemini-name-service";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function isValidKoreanNamePhonetics(name: string): boolean {
  const trimmed = name.trim();
  if (!/^[가-힣]{1,5}$/.test(trimmed)) return false;
  const invalidChars = /[쀍뛣뀀꿿쀼믜긇쓿]/;
  return !invalidChars.test(trimmed);
}

export async function runAdversarialNameAuditSubagent(
  hangulName: string,
  draft: GeneratedNameMeaning
) {
  const syllables = Array.from(hangulName);
  if (!draft.syllableBreakdown || draft.syllableBreakdown.length !== syllables.length) {
    return {
      passed: false,
      totalScore: 40,
      issuesFound: ["음절 개수 불일치"],
      revisionInstruction: "입력 한글 이름의 글자 수와 순서를 100% 일치시키세요."
    };
  }
  // Gemini Red-Team Critic Call (음가 일치 25점 + 심미성 25점 + SEO 독창성 25점 + 스키마 25점)
  // 90점 미만 시 passed: false 및 revisionInstruction 반환 -> 생성 에이전트 자동 재작성!
}