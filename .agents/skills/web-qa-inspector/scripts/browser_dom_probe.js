/**
 * browser_dom_probe.js
 * In-browser DOM QA evaluator for web-qa-inspector skill.
 * Run inside Chrome DevTools / Puppeteer / Playwright page.evaluate() across Desktop (1280x800) and Mobile (390x844).
 */
window.runWebQaDomProbe = function(expectedLang = 'ko') {
  const issues = [];
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // 1. Horizontal overflow check (crucial for mobile 390x844)
  const docWidth = document.documentElement.scrollWidth;
  if (docWidth > vw + 2) {
    issues.push({
      type: 'HORIZONTAL_OVERFLOW',
      severity: 'HIGH',
      detail: `Document scrollWidth (${docWidth}px) exceeds viewport width (${vw}px)`
    });
  }

  // 2. Broken images check
  document.querySelectorAll('img').forEach((img) => {
    const rect = img.getBoundingClientRect();
    const style = window.getComputedStyle(img);
    if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0) return;
    if (!img.complete || img.naturalWidth === 0) {
      issues.push({
        type: 'BROKEN_IMAGE',
        severity: 'HIGH',
        detail: `Broken image: src="${img.currentSrc || img.src}" alt="${img.alt}"`
      });
    }
  });

  // 3. Unstyled raw links check (default browser blue #0000ee / rgb(0, 0, 238))
  document.querySelectorAll('a').forEach((a) => {
    const rect = a.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const style = window.getComputedStyle(a);
    if (style.color === 'rgb(0, 0, 238)' && style.textDecorationLine === 'underline') {
      issues.push({
        type: 'UNSTYLED_LINK',
        severity: 'HIGH',
        detail: `Unstyled default blue link detected: "${(a.textContent || '').trim().slice(0, 50)}"`
      });
    }
  });

  // 4. Button / CTA text clipping check
  document.querySelectorAll('button, .btn, .pd-promo-cta, .step-nav-btn, .btn-main, .cross-go-level-btn').forEach((btn) => {
    const rect = btn.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const parent = btn.parentElement;
    if (parent) {
      const pStyle = window.getComputedStyle(parent);
      const pRect = parent.getBoundingClientRect();
      if ((pStyle.overflow === 'hidden' || pStyle.overflowY === 'hidden') && rect.bottom > pRect.bottom + 2) {
        issues.push({
          type: 'ELEMENT_CLIPPED',
          severity: 'HIGH',
          detail: `Button "${(btn.textContent || '').trim().slice(0, 40)}" is clipped by parent <${parent.tagName.toLowerCase()}.${parent.className}>`
        });
      }
    }
  });

  // 5. Header title vs right-side controls overlap check
  const brand = document.querySelector('.brand-link, .brand-logo, .header-brand');
  const langSel = document.querySelector('#lang-select, .lang-selector-wrap, .lang-compact-wrapper');
  if (brand && langSel) {
    const b = brand.getBoundingClientRect();
    const l = langSel.getBoundingClientRect();
    const overlapX = Math.max(0, Math.min(b.right, l.right) - Math.max(b.left, l.left));
    const overlapY = Math.max(0, Math.min(b.bottom, l.bottom) - Math.max(b.top, l.top));
    if (overlapX > 4 && overlapY > 4) {
      issues.push({
        type: 'HEADER_OVERLAP',
        severity: 'HIGH',
        detail: `Brand header overlaps language selector by ${Math.round(overlapX)}x${Math.round(overlapY)}px`
      });
    }
  }

  // 6. Strict Zero-Hangul-Leak check when expectedLang !== 'ko'
  if (expectedLang && expectedLang !== 'ko') {
    const hangulRegex = /[가-힣]+/;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const text = (node.nodeValue || '').trim();
      if (!text || !hangulRegex.test(text)) continue;
      const el = node.parentElement;
      if (!el) continue;
      const tag = el.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'option') continue;
      if (el.closest('[hidden], .hidden')) continue;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      issues.push({
        type: 'UNTRANSLATED_HANGUL_LEAK',
        severity: 'HIGH',
        detail: `Visible Hangul found on lang="${expectedLang}" in <${tag}${el.id ? '#' + el.id : ''}${el.className ? '.' + String(el.className).trim().replace(/\s+/g, '.') : ''}>: "${text.slice(0, 60)}"`
      });
    }
  }

  return {
    viewport: `${vw}x${vh}`,
    lang: expectedLang,
    pass: issues.length === 0,
    issueCount: issues.length,
    issues
  };
};
