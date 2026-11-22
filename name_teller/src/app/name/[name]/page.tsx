// src/app/name/[name]/page.tsx
import React from "react";
import { Metadata } from "next";
import { getOrGenerateNameMeaning } from "@/lib/gemini-name-service";
import AdSenseBanner from "@/components/AdSenseBanner";

export const revalidate = 3600; // ISR: 1시간 주기 정적 캐시 갱신

interface PageProps {
  params: { name: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const decodedName = decodeURIComponent(params.name);
  const { entry } = await getOrGenerateNameMeaning(decodedName);

  // 호기심 유발형 6~7자 말줄임 티저 (Curiosity Gap SEO)
  const cleanMeaning = (entry.poeticTitle || "").replace(/^\[.*?\]\s*/, "");
  const shortTeaser = cleanMeaning.slice(0, 7) + "...";

  const title = `${entry.hangulName} 이름 뜻 확인하기 (${shortTeaser}) | 이쁜 아기 이름 추천 · 익명편지함`;
  const description = `'${entry.hangulName}(${entry.primaryHanja})'의 숨겨진 뜻: "${shortTeaser}" 지금 전체 한자·순우리말 시어 뜻풀이와 '${entry.hangulName}' 전용 365일 채팅형 익명편지함을 확인해보세요! (이쁜 아기 이름 추천 · 이름 뜻 확인하기 · 익명편지함)`;

  return {
    title,
    description,
    keywords: [
      entry.hangulName,
      `${entry.hangulName} 뜻`,
      `${entry.hangulName} 한자`,
      "이쁜 아기 이름 추천",
      "이름 뜻 확인하기",
      "익명편지함",
      "순우리말 이름",
      "시집 예쁜 단어 이름"
    ],
    robots: entry.isIndexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: `https://name-teller.pages.dev/name/${encodeURIComponent(entry.hangulName)}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function NameDetailPage({ params }: PageProps) {
  const decodedName = decodeURIComponent(params.name);
  const { entry, newlyGenerated } = await getOrGenerateNameMeaning(decodedName);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        name: `${entry.hangulName} (${entry.primaryHanja})`,
        description: entry.poeticTitle,
        inDefinedTermSet: "https://name-teller.pages.dev",
      },
      {
        "@type": "FAQPage",
        mainEntity: (entry.faqItems as Array<{ question: string; answer: string }>).map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* AdSense Slot #1: 상단 반응형 배너 (CLS=0 고정 높이) */}
      <AdSenseBanner adSlot="1000000001" minHeight="100px" label="SPONSORED · 상단 배너" />

      {/* 대표 한자 뜻풀이 카드 */}
      <article className="rounded-3xl bg-white p-8 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            🛡️ 이름 품질 검증 완료 ({entry.qcAuditScore}점)
          </span>
          {newlyGenerated && (
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
              ✨ Gemini AI 생성 & DB 신규 등재 완료
            </span>
          )}
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-stone-900">
          {entry.hangulName} <span className="text-amber-600">({entry.primaryHanja})</span>
        </h1>
        <p className="mt-2 text-xl font-medium text-stone-700">“{entry.poeticTitle}”</p>
        <p className="mt-6 leading-relaxed text-stone-600 whitespace-pre-line">
          {entry.storyInterpretation}
        </p>
      </article>

      {/* AdSense Slot #2: 본문 직하단 인아티클 광고 (최고 CTR 구간) */}
      <AdSenseBanner adSlot="1000000002" adFormat="fluid" minHeight="150px" label="SPONSORED · 인아티클 추천" />

      {/* 익명 메시지 전달소 섹션 */}
      <section className="mt-8 rounded-3xl bg-rose-50/50 p-8 border border-rose-200">
        <h2 className="text-2xl font-bold text-stone-900">
          💌 전국의 ‘{entry.hangulName}’님에게 도착한 익명 메시지 전달소
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          모든 메시지는 UGC 클린봇 검수를 거쳐 안전하고 따뜻한 마음만 전달됩니다.
        </p>
      </section>

      {/* AdSense Slot #4: 하단 멀티플렉스 광고 */}
      <AdSenseBanner adSlot="1000000004" adFormat="auto" minHeight="220px" label="SPONSORED · 연관 추천" />
    </main>
  );
}
