// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://name-teller.pages.dev";

/**
 * ?덉쭏 寃?섎? ?듦낵??isIndexable = true, qcAuditScore >= 90)
 * ?쒓? ?대쫫 ?섏씠吏留??숈쟻?쇰줈 Sitemap.xml???몄텧?섏뿬 援ш?/?ㅼ씠踰?寃???덉쭏怨?而ㅻ쾭由ъ?瑜??숈떆??洹밸??뷀빀?덈떎.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const names = await prisma.nameEntry.findMany({
    where: { isIndexable: true },
    select: { hangulName: true, updatedAt: true },
    orderBy: { searchCount: "desc" },
    take: 45000,
  });

  const initials = ["??,"??,"??,"??,"??,"??,"??,"??,"??,"??,"??,"??,"??,"??];
  const hubUrls: MetadataRoute.Sitemap = initials.map((init) => ({
    url: `${BASE_URL}/names/initial/${encodeURIComponent(init)}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const nameUrls: MetadataRoute.Sitemap = names.map((item) => ({
    url: `${BASE_URL}/name/${encodeURIComponent(item.hangulName)}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...hubUrls,
    ...nameUrls,
  ];
}
