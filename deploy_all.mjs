#!/usr/bin/env node
/**
 * TellMyName Universe — Unified Monorepo Build, Korean Humanizer Verification & Cloudflare Workers Deploy Orchestrator
 *
 * Apps managed in this monorepo:
 *  1. name_teller (https://tellmyname.app)
 *  2. myhome      (https://myhome.tellmyname.app)
 *  3. food        (https://food.tellmyname.app)
 *  4. occupation  (https://job.tellmyname.app)
 *  5. car         (https://car.tellmyname.app)
 *
 * Usage:
 *  - Verify Korean & build all apps: node deploy_all.mjs --build-only  (or: npm run build)
 *  - Verify, build & deploy all 5 apps to Cloudflare Workers: node deploy_all.mjs --deploy (or: npm run deploy)
 *  - Deploy a specific subset: node deploy_all.mjs --deploy --only=myhome,food,name_teller
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
const VERIFY_SCRIPT = 'C:\\Users\\USER\\.gemini\\config\\skills\\korean-humanizer\\scripts\\verify_korean.py';
const QA_AUDIT_SCRIPT = 'C:\\Users\\USER\\.gemini\\config\\skills\\web-qa-inspector\\scripts\\audit_web_qa.py';

const APPS = [
  {
    id: 'name_teller',
    domain: 'https://tellmyname.app',
    dir: path.join(ROOT_DIR, 'name_teller'),
    hasStaticGenerator: false,
    verifyTargets: ['web/index.html']
  },
  {
    id: 'myhome',
    domain: 'https://myhome.tellmyname.app',
    dir: path.join(ROOT_DIR, 'myhome'),
    hasStaticGenerator: true,
    verifyTargets: ['web/index.html', 'data/chunks']
  },
  {
    id: 'food',
    domain: 'https://food.tellmyname.app',
    dir: path.join(ROOT_DIR, 'food'),
    hasStaticGenerator: true,
    verifyTargets: ['web/index.html', 'data/foods_master.json']
  },
  {
    id: 'occupation',
    domain: 'https://job.tellmyname.app',
    dir: path.join(ROOT_DIR, 'occupation'),
    hasStaticGenerator: true,
    verifyTargets: ['web/index.html', 'data/chunks']
  },
  {
    id: 'car',
    domain: 'https://car.tellmyname.app',
    dir: path.join(ROOT_DIR, 'car'),
    hasStaticGenerator: true,
    verifyTargets: ['web/index.html', 'data/chunks']
  }
];

const args = process.argv.slice(2);
const shouldDeploy = args.includes('--deploy');
const skipVerify = args.includes('--skip-verify');
const onlyArg = args.find(a => a.startsWith('--only='));
const onlySet = onlyArg
  ? new Set(onlyArg.replace('--only=', '').split(',').map(s => s.trim()).filter(Boolean))
  : null;

const selectedApps = onlySet ? APPS.filter(a => onlySet.has(a.id)) : APPS;

if (selectedApps.length === 0) {
  console.error('No matching apps found for --only filter.');
  process.exit(1);
}

console.log('==================================================================');
console.log(`TellMyName Universe Monorepo Orchestrator (${selectedApps.map(a => a.id).join(', ')})`);
console.log(`Mode: ${shouldDeploy ? 'VERIFY + BUILD + CLOUDFLARE DEPLOY' : 'VERIFY + BUILD ONLY'}`);
console.log('==================================================================\n');

for (const app of selectedApps) {
  console.log(`\n------------------------------------------------------------------`);
  console.log(`[App: ${app.id}] (${app.domain})`);
  console.log(`------------------------------------------------------------------`);

  // 1. Korean Humanizer Verification
  if (!skipVerify && fs.existsSync(VERIFY_SCRIPT)) {
    for (const relTarget of app.verifyTargets) {
      const targetPath = path.join(app.dir, relTarget);
      if (fs.existsSync(targetPath)) {
        console.log(`  -> [1/3] Running Korean Humanizer Gate on ${app.id}/${relTarget}...`);
        execSync(`python "${VERIFY_SCRIPT}" "${targetPath}"`, {
          cwd: app.dir,
          stdio: 'inherit'
        });
      }
    }
  }

  // 2. Build / Sync dist
  console.log(`  -> [2/3] Building static assets for ${app.id}...`);
  if (app.hasStaticGenerator) {
    execSync('node scripts/generate_static_site.mjs', {
      cwd: app.dir,
      stdio: 'inherit'
    });
  } else {
    // Sync all files from name_teller/web/* -> name_teller/dist/* (including samples/italy/*)
    const srcDir = path.join(app.dir, 'web');
    const distDir = path.join(app.dir, 'dist');
    if (fs.existsSync(srcDir)) {
      fs.cpSync(srcDir, distDir, { recursive: true, force: true });
      console.log(`  ✔ Synced ${app.id}/web/* -> ${app.id}/dist/*`);
    }
  }

  // 3. Deploy via Wrangler if requested
  if (shouldDeploy) {
    console.log(`  -> [3/3] Deploying ${app.id} (${app.domain}) via npx wrangler deploy...`);
    execSync('npx wrangler deploy', {
      cwd: app.dir,
      stdio: 'inherit'
    });
  } else {
    console.log(`  -> [3/3] Skipping deploy (pass --deploy to publish to Cloudflare Workers)`);
  }
}

console.log('\n==================================================================');
if (!skipVerify && fs.existsSync(QA_AUDIT_SCRIPT)) {
  console.log('Running Web QA Inspector (Static & Multilingual Dataset Audit)...');
  execSync(`python "${QA_AUDIT_SCRIPT}" "${ROOT_DIR}"`, {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });
}
console.log(`✔ Completed all tasks for ${selectedApps.length} app(s).`);
console.log('==================================================================');
