// scripts/configure_adsense.mjs
// Google AdSense Configuration & CLI Helper
// Usage: node scripts/configure_adsense.mjs ca-pub-XXXXXXXXXXXXXXXX [topSlotId] [inArticleSlotId] [chatFeedSlotId] [reelsFeedSlotId]

import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const configPath = path.join(rootDir, 'config/adsense.config.json');
const publicAdsTxtPath = path.join(rootDir, 'public/ads.txt');
const distAdsTxtPath = path.join(rootDir, 'dist/ads.txt');

const args = process.argv.slice(2);
const publisherIdArg = args[0];

if (!publisherIdArg || !publisherIdArg.startsWith('ca-pub-')) {
  console.error('❌ Error: Please provide a valid AdSense Publisher ID starting with "ca-pub-".');
  console.error('Usage: node scripts/configure_adsense.mjs ca-pub-XXXXXXXXXXXXXXXX [topSlotId] [inArticleSlotId] [chatFeedSlotId] [reelsFeedSlotId]');
  process.exit(1);
}

let config = {
  enabled: true,
  publisherId: publisherIdArg,
  autoAds: true,
  slots: {
    topBanner: args[1] || '1000000001',
    inArticle: args[2] || '1000000002',
    chatInFeed: args[3] || '1000000003',
    reelsInFeed: args[4] || '1000000004',
    bottomMultiplex: '1000000005'
  },
  contactEmail: 'contact@tellmyname.app'
};

if (fs.existsSync(configPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config = { ...existing, ...config };
    if (args[1]) config.slots.topBanner = args[1];
    if (args[2]) config.slots.inArticle = args[2];
    if (args[3]) config.slots.chatInFeed = args[3];
    if (args[4]) config.slots.reelsInFeed = args[4];
  } catch (e) {
    // use default
  }
}

// Ensure parent dir exists
if (!fs.existsSync(path.dirname(configPath))) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
}
if (!fs.existsSync(path.dirname(publicAdsTxtPath))) {
  fs.mkdirSync(path.dirname(publicAdsTxtPath), { recursive: true });
}

// 1. Save config/adsense.config.json
fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log(`✅ Updated ${configPath} with Publisher ID: ${config.publisherId}`);

// 2. Generate public/ads.txt (google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0)
const pubNumber = config.publisherId.replace('ca-', '');
const adsTxtContent = `google.com, ${pubNumber}, DIRECT, f08c47fec0942fa0\n`;
fs.writeFileSync(publicAdsTxtPath, adsTxtContent, 'utf8');
console.log(`✅ Generated ${publicAdsTxtPath}`);

if (!fs.existsSync(path.join(rootDir, 'dist'))) {
  fs.mkdirSync(path.join(rootDir, 'dist'), { recursive: true });
}
fs.writeFileSync(distAdsTxtPath, adsTxtContent, 'utf8');
console.log(`✅ Generated ${distAdsTxtPath}`);

console.log('🎉 Google AdSense configuration successfully applied!');
