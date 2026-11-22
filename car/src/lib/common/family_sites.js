// src/lib/common/family_sites.js — Shared tellmyname.app Family Network Registry & Sitemap Cross-Linker
// Reusable across car, occupation, myhome, food, photodiary

export const FAMILY_SITES = [
  {
    id: 'car',
    emoji: '🚗',
    domain: 'car.tellmyname.app',
    origin: 'https://car.tellmyname.app',
    sitemapUrl: 'https://car.tellmyname.app/sitemap.xml',
    i18nKey: 'familyCar',
    defaultLabel: '🚗 나에게 어울리는 자동차'
  },
  {
    id: 'job',
    emoji: '💼',
    domain: 'job.tellmyname.app',
    origin: 'https://job.tellmyname.app',
    sitemapUrl: 'https://job.tellmyname.app/sitemap.xml',
    i18nKey: 'familyJob',
    defaultLabel: '💼 나에게 어울리는 직업'
  },
  {
    id: 'myhome',
    emoji: '🏠',
    domain: 'myhome.tellmyname.app',
    origin: 'https://myhome.tellmyname.app',
    sitemapUrl: 'https://myhome.tellmyname.app/sitemap.xml',
    i18nKey: 'familyHome',
    defaultLabel: '🏠 나에게 어울리는 집'
  },
  {
    id: 'food',
    emoji: '🍔',
    domain: 'food.tellmyname.app',
    origin: 'https://food.tellmyname.app',
    sitemapUrl: 'https://food.tellmyname.app/sitemap.xml',
    i18nKey: 'familyFood',
    defaultLabel: '🍔 나에게 어울리는 음식'
  },
  {
    id: 'photodiary',
    emoji: '📸',
    domain: 'photodiary.tellmyname.app',
    origin: 'https://photodiary.tellmyname.app',
    sitemapUrl: 'https://photodiary.tellmyname.app/sitemap.xml',
    i18nKey: 'familyPhotodiary',
    defaultLabel: '📸 포토다이어리'
  }
];

export function getFamilySitemapUrls() {
  return FAMILY_SITES.map(site => site.sitemapUrl);
}

export function getFamilyOrigins() {
  return FAMILY_SITES.map(site => site.origin);
}
