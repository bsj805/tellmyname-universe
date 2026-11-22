# ISSUE-13: Cloudflare Workers + Static Assets 배포 (npx wrangler deploy)

상위 기획: [PLANNING_SPEC_V2 부록 A.4](../PLANNING_SPEC_V2_MOBILE_I18N_SEO.md#a4-13-cloudflare-workers-정적-호스팅-workers--pages--workers--static-assets)

- `wrangler.toml`: Workers Static Assets, R2 바인딩 제거, custom domain 라우트
- `scripts/optimize_images.py`: PNG(≈800MB) → `images/web/*.webp`(768px) + `*.jpg`(OG)
- `package.json`: build = i18n 번들 + 정적 빌드, deploy = `npx wrangler deploy`, devDependency wrangler
- `docs/DEPLOY_CLOUDFLARE.md`

## 대시보드 입력값
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

## 수용 기준
- [ ] `dist/` < 150MB, 파일 < 20,000개, 단일 파일 < 25MiB
- [ ] `npx wrangler deploy --dry-run --outdir .wrangler-dry` 성공
