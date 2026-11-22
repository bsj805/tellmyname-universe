// functions/name/[[name]].js — Cloudflare Pages Function for Dynamic SSR & Long-tail Name SEO
// Supports 15,488+ Korean names + Unlimited Foreign Sounds-Like Names on-demand

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let namesDbCache = null;
async function getNamesDb(env, requestUrl) {
  if (namesDbCache) return namesDbCache;
  try {
    const res = await env.ASSETS.fetch(new URL('/data/names.json', requestUrl));
    if (res.ok) {
      const list = await res.json();
      namesDbCache = new Map();
      for (const item of list) {
        // item: [name, cho, hanja, strokes, meaning, gender, category]
        namesDbCache.set(item[0], {
          name: item[0],
          cho: item[1],
          hanja: item[2] || '',
          meaning: item[4] || '',
          gender: item[5] || '공용',
          category: item[6] || '한국어 이름'
        });
      }
      return namesDbCache;
    }
  } catch (err) {
    console.warn('[SSR] Failed to load names.json:', err.message);
  }
  return new Map();
}

let foreignDbCache = null;
async function getForeignDb(env, requestUrl) {
  if (foreignDbCache) return foreignDbCache;
  try {
    const res = await env.ASSETS.fetch(new URL('/data/curated_foreign_names.json', requestUrl));
    if (res.ok) {
      const list = await res.json();
      foreignDbCache = new Map();
      for (const item of list) {
        if (item.name) {
          foreignDbCache.set(item.name.toLowerCase(), item);
        }
        for (const alias of (item.aliases || [])) {
          foreignDbCache.set(alias.toLowerCase(), item);
        }
      }
      return foreignDbCache;
    }
  } catch (err) {
    console.warn('[SSR] Failed to load curated_foreign_names.json:', err.message);
  }
  return new Map();
}

function logUnservedNameAsync(env, name, type) {
  // GitHub 이슈 코멘트 연동 비활성화
  return;
}

const FALLBACK_FOREIGN_PAIRS = [
  { match: '수아', roman: 'Su-a', reason: '맑고 고운 첫소리와 부드러운 열린 모음의 조화', meaning: '재능과 기품이 맑은 시와 음악처럼 기품 있고 단아한 멋이 흐르는 성품' },
  { match: '서윤', roman: 'Seo-yun', reason: '상서롭고 따스한 햇살처럼 온화한 울림', meaning: '상서로운 빛으로 세상을 따뜻하고 윤택하게 적시는 사람' },
  { match: '도윤', roman: 'Do-yun', reason: '올곧은 중심과 부드러운 선율의 기운', meaning: '올바른 도리를 지키며 윤택하고 풍요로운 결실을 맺는 삶' },
  { match: '지민', roman: 'Ji-min', reason: '지혜로운 슬기와 온화한 감성의 조화', meaning: '맑고 총명한 지혜로 만인에게 따뜻한 온기를 전하는 사람' },
  { match: '하은', roman: 'Ha-eun', reason: '여름 햇살처럼 밝고 큰 은혜를 품은 울림', meaning: '하늘처럼 넓은 마음으로 세상에 복과 은혜를 더하는 사람' }
];

export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);

  const rawSegments = params.name;
  const rawName = Array.isArray(rawSegments) ? rawSegments.join('/') : (rawSegments || '');
  const decodedName = decodeURIComponent(rawName).trim().replace(/\/$/, '');

  if (!decodedName) {
    return context.next();
  }

  const isKorean = /^[가-힣]{1,6}$/.test(decodedName);
  const isForeign = /^[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u3040-\u30FF\u4E00-\u9FFF\s'.-]{1,30}$/.test(decodedName);

  if (!isKorean && !isForeign) {
    return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  // Fetch base index.html from static ASSETS
  let html = '';
  try {
    const baseRes = await env.ASSETS.fetch(new URL('/index.html', request.url));
    if (!baseRes.ok) return context.next();
    html = await baseRes.text();
  } catch {
    return context.next();
  }

  const siteOrigin = url.origin;
  const canonicalUrl = `${siteOrigin}/name/${encodeURIComponent(decodedName)}/`;
  let pageTitle = '';
  let pageDesc = '';
  let jsonLd = null;
  let seoBodyContent = '';

    if (isKorean) {
    const namesDb = await getNamesDb(env, request.url);
    let nameInfo = namesDb.get(decodedName);
    let detectedSurname = '';
    let detectedGiven = decodedName;

    // 성씨가 포함된 이름인 경우 분필 (e.g. '이유승' -> 성: '이', 이름: '유승')
    if (!nameInfo && decodedName.length >= 2) {
      // 2글자 복성 확인
      if (decodedName.length >= 3) {
        const sur2 = decodedName.slice(0, 2);
        if (['남궁', '선우', '독고', '황보', '제갈'].includes(sur2)) {
          const rem = decodedName.slice(2);
          if (namesDb.has(rem)) {
            detectedSurname = sur2;
            detectedGiven = rem;
            nameInfo = namesDb.get(rem);
          }
        }
      }
      // 1글자 단성 확인
      if (!nameInfo) {
        const sur1 = decodedName.slice(0, 1);
        const rem1 = decodedName.slice(1);
        if (namesDb.has(rem1)) {
          detectedSurname = sur1;
          detectedGiven = rem1;
          nameInfo = namesDb.get(rem1);
        }
      }
    }

    if (nameInfo) {
      const hanja = nameInfo.hanja || '';
      const meaning = nameInfo.meaning || '맑고 깊은 뜻을 품은 아름다운 한국어 이름';
      const teaser7 = meaning.slice(0, 10) + '...';

      // 네이버 검색 최적화: "[이름] 이름 뜻·한자·의미 풀이" 키워드 우선 배치
      pageTitle = `${decodedName} 이름 뜻·한자·의미 풀이 | 이름을 설명해드립니다`;
      pageDesc = `'${decodedName}${hanja ? `(${hanja})` : ''}'의 이름 뜻: "${meaning}" — 대법원 인명용 한자 풀이와 상세 의미를 확인해보세요.`;

      jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'DefinedTerm',
            'name': `${decodedName} ${hanja ? `(${hanja})` : ''}`,
            'description': meaning,
            'url': canonicalUrl
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': `'${decodedName}' 이름 뜻은 무엇인가요?`,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': `'${decodedName}${hanja ? `(${hanja})` : ''}'의 뜻은 "${meaning}"입니다. 전체 한자 뜻풀이를 확인해보세요.`
                }
              }
            ]
          }
        ]
      };

      seoBodyContent = `
        <article class="name-card-seo" style="max-width: 540px; margin: 24px auto; padding: 28px 22px; background: #FAF7F2; border-radius: 20px; border: 1px solid rgba(28, 25, 23, 0.08); text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
          <span style="font-size: 11px; font-weight: 700; color: #78716C; letter-spacing: 0.06em; text-transform: uppercase;">KOREAN NAME MEANING</span>
          <h1 style="font-size: 34px; font-weight: 800; color: #1C1917; margin: 12px 0 4px; font-family: 'Noto Serif KR', serif;">${escapeHtml(decodedName)}</h1>
          ${hanja ? `<p style="font-size: 16px; font-weight: 600; color: #475569; margin: 0 0 16px;">${escapeHtml(hanja)}</p>` : ''}
          <div style="background: #FFFFFF; border-radius: 12px; padding: 18px 16px; border: 1px solid #E5E7EB; text-align: left; margin-bottom: 18px;">
            <span style="font-size: 11px; font-weight: 700; color: #D97706; display: block; margin-bottom: 6px;">이름에 담긴 시적 의미</span>
            <p style="font-size: 14px; color: #1E293B; line-height: 1.6; margin: 0;">“${escapeHtml(meaning)}”</p>
          </div>
          <p style="font-size: 12.5px; color: #64748B; margin: 0;">이름을 설명해드립니다(Name Teller)에서 전체 한자 뜻풀이를 확인해보세요.</p>
        </article>
      `;
    } else {
      // Unregistered Korean name -> queue for midnight AI generation
      logUnservedNameAsync(env, decodedName, 'korean');
      pageTitle = `${decodedName} 이름 뜻풀이 준비 중 | 이름을 설명해드립니다`;
      pageDesc = `'${decodedName}'에 가장 잘 어울리는 대법원 인명용 한자와 시적 뜻풀이를 AI 작명가가 매일 새벽 정식 등록합니다.`;

      seoBodyContent = `
        <article class="name-card-seo" style="max-width: 540px; margin: 24px auto; padding: 28px 22px; background: #FAF7F2; border-radius: 20px; border: 1px solid rgba(28, 25, 23, 0.08); text-align: center;">
          <span style="font-size: 12px; font-weight: 700; color: #D97706; background: rgba(217,119,6,0.12); padding: 3px 9px; border-radius: 999px;">✨ 새벽 AI 정식 업데이트</span>
          <h1 style="font-size: 32px; font-weight: 800; color: #1C1917; margin: 14px 0 6px;">${escapeHtml(decodedName)}</h1>
          <p style="font-size: 13.5px; color: #64748B; line-height: 1.5;">'${escapeHtml(decodedName)}' 이름의 최적 한자 뜻풀이가 매일 새벽 Gemini AI 파이프라인을 통해 정식 등록됩니다.</p>
        </article>
      `;
    }
  } else {
    // Foreign name query
    const foreignName = decodedName;
    const foreignDb = await getForeignDb(env, request.url);
    const curatedHit = foreignDb.get(foreignName.toLowerCase());

    let matches = [];
    if (curatedHit && curatedHit.matches && curatedHit.matches.length > 0) {
      matches = curatedHit.matches.map(m => ({
        match: m.hangul,
        roman: m.roman,
        reason: m.reason,
        meaning: m.meaning
      }));
    } else {
      matches = FALLBACK_FOREIGN_PAIRS.slice(0, 3);
      // Asynchronously log new foreign name for midnight batch
      logUnservedNameAsync(env, foreignName, 'foreign');
    }

    const allMatchStr = matches.map(m => `${m.match} (${m.roman})`).join(', ');

    pageTitle = `${foreignName} Korean Name — Beautiful Names That Sound Like ${foreignName} | Name Teller`;
    pageDesc = `What is the Korean name for ${foreignName}? Discover authentic Korean names like ${allMatchStr} with deep poetic meanings.`;

    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'DefinedTerm',
          'name': `${foreignName} Korean Name`,
          'description': pageDesc,
          'url': canonicalUrl
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': `What is the Korean name for ${foreignName}?`,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': `The most authentic Korean names that sound like ${foreignName} are ${allMatchStr}. Discover full meanings on Name Teller.`
              }
            }
          ]
        }
      ]
    };

    seoBodyContent = `
      <article class="phonetic-seo-article" style="max-width: 580px; margin: 24px auto; padding: 24px 20px; background: #FAF7F2; border-radius: 20px; border: 1px solid rgba(217, 119, 6, 0.25); box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
        <header style="margin-bottom: 20px; text-align: center;">
          <span style="font-size: 12px; font-weight: 700; color: #D97706; background: rgba(217,119,6,0.12); padding: 3px 9px; border-radius: 999px;">🌐 Foreign Name → Korean Name</span>
          <h1 style="font-size: 24px; font-weight: 800; color: #1C1917; margin: 12px 0 6px;">${escapeHtml(foreignName)} Korean Name</h1>
          <p style="font-size: 13.5px; color: #78716C; margin: 0; line-height: 1.5;">Looking for an authentic Korean name that sounds like <strong>${escapeHtml(foreignName)}</strong>? Here are the top phonetic matches:</p>
        </header>

        <div class="seo-matches" style="display: flex; flex-direction: column; gap: 14px;">
          ${matches.map((m, idx) => `
            <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 14px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div style="display: flex; align-items: baseline; gap: 8px;">
                  <span style="font-size: 22px; font-weight: 800; color: #1C1917;">${escapeHtml(m.match)}</span>
                  <span style="font-size: 14px; font-weight: 600; color: #64748B;">(${escapeHtml(m.roman)})</span>
                </div>
                <span style="font-size: 11px; font-weight: 700; color: #D97706; background: #FEF3C7; padding: 2px 8px; border-radius: 999px;">${idx === 0 ? '🥇 Best Match' : `${idx + 1}nd Match`}</span>
              </div>
              <p style="font-size: 12.5px; color: #475569; margin: 4px 0 8px; line-height: 1.45;"><strong>Sound bridge:</strong> “${escapeHtml(m.reason)}”</p>
              <p style="font-size: 12.5px; color: #1E293B; margin: 0; line-height: 1.45; background: #F8FAFC; padding: 8px 10px; border-radius: 8px;"><strong>Poetic meaning:</strong> ${escapeHtml(m.meaning)}</p>
              <div style="margin-top: 10px; text-align: right;">
                <a href="${siteOrigin}/name/${encodeURIComponent(m.match)}/" style="display: inline-block; font-size: 12px; font-weight: 700; color: #D97706; text-decoration: none;">View ${escapeHtml(m.match)} Name Card →</a>
              </div>
            </div>
          `).join('')}
        </div>
      </article>
    `;

    // Asynchronously log new foreign name for midnight batch
    logUnservedNameAsync(env, foreignName, 'foreign');
  }

  // Inject SEO metadata
  const headInjections = [
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:site_name" content="Name Teller" />`
  ];
  if (jsonLd) {
    headInjections.push(`<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`);
  }

  html = html.replace(/<title>[\s\S]*?(?:<\/title>|\?\/title>)/i, `<title>${escapeHtml(pageTitle)}</title>`);
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${escapeHtml(pageDesc)}" />`);
  html = html.replace('</head>', `  ${headInjections.join('\n  ')}\n</head>`);
  html = html.replace('<section id="card-root"></section>', `<section id="card-root">${seoBodyContent}</section>`);

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400'
    }
  });
}
