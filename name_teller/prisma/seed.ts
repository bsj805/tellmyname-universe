// prisma/seed.ts
import { PrismaClient, SourceType } from "@prisma/client";
import seedData from "./baseline_names_seed.json";

const prisma = new PrismaClient();

async function main() {
  console.log(`[Name Teller Seed] Starting bulk upsert of ${seedData.totalNamesCount} Korean names & Hanja meanings...`);
  let upserted = 0;

  for (const item of seedData.names) {
    const storyText =
      `‘${item.hangulName}(${item.primaryHanja})’이라는 이름은 ${item.poeticTitle}이라는 아름다운 축복을 담고 있습니다.\n\n` +
      item.syllableBreakdown
        .map((b, idx) => `${idx + 1}번째 음절 ‘${b.hangul}(${b.hanja})’은 ‘${b.meaning}(${b.strokeCount}획, ${b.ohaeng})’으로, ${b.symbolism}을 상징합니다.`)
        .join(" ");

    await prisma.nameEntry.upsert({
      where: { hangulName: item.hangulName },
      update: {
        primaryHanja: item.primaryHanja,
        poeticTitle: item.poeticTitle,
        qcAuditScore: item.qcAuditScore,
      },
      create: {
        hangulName: item.hangulName,
        initialConsonant: item.initialConsonant,
        primaryHanja: item.primaryHanja,
        syllableBreakdown: item.syllableBreakdown,
        poeticTitle: item.poeticTitle,
        storyInterpretation: storyText,
        altHanjaCombos: [
          {
            hanja: item.altHanja,
            reading: `${item.hangulName} (${item.syllableBreakdown.map((s) => s.altMeaning).join(" · ")})`,
            summary: "차분한 품격과 맑은 진심을 함께 담아낸 대법원 인명용 대안 한자 조합",
          },
        ],
        vibeTags: item.vibeTags,
        faqItems: [
          {
            question: `‘${item.hangulName}’ 이름에 가장 어울리는 인명용 한자 조합은 무엇인가요?`,
            answer: `가장 추천하는 대표 한자는 ‘${item.primaryHanja}’(${item.syllableBreakdown.map((s) => s.meaning).join(", ")})이며, 대안 조합으로는 ‘${item.altHanja}’이 있습니다.`,
          },
        ],
        sourceType: SourceType.SEED,
        qcAuditScore: item.qcAuditScore,
        isIndexable: true,
        searchCount: item.searchCount,
      },
    });
    upserted++;
  }

  console.log(`[Name Teller Seed] Successfully loaded ${upserted} baseline Korean names into PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
