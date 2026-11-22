---
name: seo-optimizer
description: >-
  Comprehensive Global SEO optimization and diagnostic skill covering 14+ target countries: Korea (Naver Yeti, Daum), Global/India/Indonesia/Malaysia/LATAM (Google, Bing, IndexNow), Vietnam (Cốc Cốc), Russia (Yandex, Mail.ru), China (Baidu, Bing China, Sogou, 360, Shenma, Petal), Japan (Google/Yahoo! JAPAN), and Europe (Qwant, Ecosia, DuckDuckGo). Activate this skill whenever the user asks to optimize SEO, check SEO status, register webmaster tools, fix search ranking/indexing issues, or audit a website's meta tags.
---

# Global 14-Country SEO Optimizer Skill (`seo-optimizer`)

Use this skill whenever the user asks to check, fix, or optimize SEO for a website across **Korea (Naver, Daum)**, **Global / India / Indonesia / Malaysia / Brazil / Spain (Google, Bing)**, **Vietnam (Cốc Cốc)**, **Russia (Yandex, Mail.ru)**, **China (Bing China, Baidu, Sogou, 360, Shenma, Petal)**, **Japan (Google & Yahoo! JAPAN)**, and **Europe (Qwant, Ecosia, DuckDuckGo)**.

---

## 1. Automated SEO Audit & Instant IndexNow Submission

1. **Run Full SEO Diagnostic Audit**:
   ```bash
   node "C:/Users/USER/.gemini/config/skills/seo-optimizer/scripts/audit_seo.mjs" https://myhome.tellmyname.app
   node "C:/Users/USER/.gemini/config/skills/seo-optimizer/scripts/audit_seo.mjs" https://photodiary.tellmyname.app
   ```
2. **Submit URLs Instantly via IndexNow (Yandex & Bing across all 14 languages)**:
   ```bash
   node "C:/Users/USER/.gemini/config/skills/seo-optimizer/scripts/submit_indexnow.mjs" https://myhome.tellmyname.app
   node "C:/Users/USER/.gemini/config/skills/seo-optimizer/scripts/submit_indexnow.mjs" https://photodiary.tellmyname.app
   ```

---

## 2. Mandatory Webmaster Registration & Verification Matrix (By Country)

Whenever optimizing or launching a website, ALWAYS verify and prompt the user to register the site on these portals and include their verification `<meta>` tags in `<head>`:

| Target Region / Country | Search Engine / Portal | Registration URL & Verification Method |
| :--- | :--- | :--- |
| **Korea (`ko`)** | **Naver Search Advisor** (`Yeti`) | https://searchadvisor.naver.com/ — `<meta name="naver-site-verification" content="..." />` + Submit `/sitemap.xml` & `/rss.xml` |
| **Korea (`ko`)** | **Daum / Kakao Search** (`Daumoa`) | https://register.search.daum.net/index.daum — Free 1-click domain submission (no meta tag required) |
| **Global, India (`hi`), Indonesia (`id`), Malaysia (`ms`), Brazil (`pt`), LATAM (`es`), Japan (`ja`)** | **Google Search Console** (`Googlebot`) | https://search.google.com/search-console — Powers **Google** (95–98% share in IN/ID/MY/BR/VN) AND **Yahoo! JAPAN** (which uses Google's index). Submit `/sitemap.xml` & `/sitemap-images.xml`. |
| **Global, China (`zh`), Europe (`de`/`fr`/`it`)** | **Bing Webmaster Tools** (`Bingbot`) | https://www.bing.com/webmasters — `<meta name="msvalidate.01" content="..." />` (or 1-click import from GSC). Powers **Bing**, **China Bing (`cn.bing.com`)**, **Yahoo**, **DuckDuckGo**, and **Ecosia (Germany)**. |
| **Russia & CIS (`ru`)** | **Yandex Webmaster** (`YandexBot`) | https://webmaster.yandex.com/ — `<meta name="yandex-verification" content="..." />` + Submit `/sitemap.xml`. |
| **Vietnam (`vi`)** | **Cốc Cốc Search** (`coccocbot-web`) | Vietnam's #2 search engine & browser (~30M users). Allow `User-agent: coccocbot-web` & `coccocbot-image` in `/robots.txt` and ensure `hreflang="vi"` self-canonical is set. |
| **China (`zh`)** | **Baidu / Sogou / Shenma / Petal** | https://ziyuan.baidu.com/ (`Baiduspider`), WeChat/Sogou (`Sogou web spider`), Alibaba Shenma (`YisouSpider`), Huawei (`PetalBot`), ByteDance (`Bytespider`). Requires static SSR body fallback (no JS dependency). |

---

## 3. Critical Multilingual Indexing Rule (Why India/Indonesia/Vietnam/Global Pages Fail to Index)

1. **Self-Referencing `<link rel="canonical">` for Every `?lang=` Page (CRITICAL)**
   - **Never** set `<link rel="canonical" href="https://example.com/" />` (the default Korean URL) when rendering a localized page like `/?lang=hi` (Hindi), `/?lang=id` (Indonesian), `/?lang=vi` (Vietnamese), `/?lang=ru` (Russian), or `/?lang=en` (English)!
   - If a `?lang=hi` page points its `canonical` to the Korean URL `/`, Google, Bing, Yandex, and Cốc Cốc treat the Hindi/Indonesian/Vietnamese page as a duplicate of the Korean page and **refuse to index the localized page**.
   - **Correct Rule**:
     - Default language (`ko`): `canonical` = `https://example.com/` (or `/name/...`)
     - Non-default language (`lang !== 'ko'`): `canonical` = `https://example.com/?lang={lang}` (self-referencing!)
     - `og:url` and `og:locale` (`hi_IN`, `id_ID`, `vi_VN`, `ru_RU`, `zh_CN`, `ja_JP`, `ms_MY`, etc.) must also dynamically match the active language.
2. **Bidirectional `hreflang` in HTML `<head>` AND `sitemap-main.xml` (`xmlns:xhtml`)**
   - In HTML `<head>`, every language page must output `<link rel="alternate" hreflang="{code}" href="{baseCanonicalUrl}?lang={code}" />` (with `ko` pointing to `{baseCanonicalUrl}`) plus `hreflang="x-default"` pointing to `{baseCanonicalUrl}`.
   - In `sitemap-main.xml`, include `xmlns:xhtml="http://www.w3.org/1999/xhtml"` and embed `<xhtml:link rel="alternate" hreflang="{code}" href="..." />` for all 14 languages inside the root `<url>` entry so search engines discover all localized entry points immediately from the sitemap.

---

## 4. IndexNow Instant Indexing Protocol (Yandex & Bing)

- **Key File Hosting**: Host `/{INDEXNOW_KEY}.txt` (`a8f4c2e9b1d703654e2a9c8b7d6f1e3a.txt`) at the root returning the exact key string with `Content-Type: text/plain; charset=utf-8` (`200 OK`).
- **Instant Push**: Run `scripts/submit_indexnow.mjs <origin>` to push all 14 language URLs (`/?lang=en`, `/?lang=hi`, `/?lang=id`, `/?lang=vi`, `/?lang=ru`, `/?lang=zh`, etc.) to `api.indexnow.org`, `yandex.com/indexnow`, and `www.bing.com/indexnow`.

---

## 5. Naver Search Advisor (네이버 서치어드바이저 · Yeti) Mandatory Rules

1. **Site Title (`<title>`) & Open Graph Title (`og:title`) — Strictly $\le 40$ Characters**
   - Place the primary Korean brand keyword at the very beginning of `<title>`.
   - On Edge SSR workers (`worker.js`), NEVER overwrite the root page (`/`) `<title>` with a sample subpage title (`isRoot = true`).
2. **Site Description (`<meta name="description">`) & `og:description` — Strictly $\le 80$ Characters**
   - Use natural, actionable Korean copy rather than stiff academic jargon.
3. **Root Canonical URL & 301 Redirect Consolidation**
   - Redirect legacy domains or old subpaths (e.g., `/match/`) with `301 Moved Permanently`.

---

## 6. Global Crawler Permissions in `/robots.txt` & Static SSR Body Fallback

1. **Static SEO Body Fallback for Non-JS Crawlers (`Baiduspider`, `YisouSpider`, `YandexBot`, `Yeti`, `coccocbot-web`)**
   - Always include either full Edge SSR (`<article class="seo-house-ssr">`) OR rich semantic fallback HTML inside `<div id="root">...</div>` containing `<h1>`, `<h2>`, `<p>`, `<ul>`, and multilingual summary sections.
2. **Explicit Global Crawler Permissions in `/robots.txt`**
   - Explicitly allow: `Yeti` (Naver), `Daumoa` (Daum/Kakao), `Googlebot` (Google & Yahoo! JAPAN), `Bingbot` (Bing, China Bing, DuckDuckGo, Ecosia), `Yandex` & `YandexBot` (Russia), `Mail.RU_Bot` (Russia), `Baiduspider`, `Sogou web spider`, `360Spider`, `YisouSpider`, `PetalBot`, `Bytespider` (China), `coccocbot-web` & `coccocbot-image` (Vietnam Cốc Cốc), `DuckDuckBot`, `Qwantify` (France).
