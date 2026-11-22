---
name: add-multilingual-name
description: >-
  Use this skill whenever adding or updating a Korean name with its multilingual
  language packs (English, Hindi, Japanese, Chinese, Spanish, Vietnamese) and
  phonetic notations (IPA, Romanization).
---

# Add Multilingual Name Skill

This skill guides the agent to systematically register a Korean name into the multilingual language pack database (`data/i18n/names_*.json`) with accurate phonetic notations (Romanization, IPA) and poetic translations across all supported languages.

---

## 1. Supported Language Packs

Language packs reside in `data/i18n/`:
- `names_en.json`: English
- `names_hi.json`: Hindi (हिन्दी)
- `names_ja.json`: Japanese (日本語)
- `names_zh.json`: Simplified Chinese (简体中文)
- `names_es.json`: Spanish (Español)
- `names_vi.json`: Vietnamese (Tiếng Việt)

Each file maps the Korean `hangulName` to its phonetic and poetic attributes:
```json
{
  "서윤": {
    "roman": "Seo-yun",
    "ipa": "sʰʌ̹.jun",
    "hanja": "瑞潤",
    "poeticTitle": "One who embraces the world with warm auspicious light and enriching grace",
    "meaning": "Auspicious light and nourishing rain"
  }
}
```

---

## 2. Standard Workflow for Adding a Name

When a new name (e.g. `도윤`, `하랑`, or `윤슬비`) needs to be added:

### Step 1: Phonetic Derivation
1. **Romanization**: National Institute of Korean Language revised romanization, hyphenated with capitalized initial syllable (e.g., `Do-yun`, `Ha-rang`, `Yun-seul-bi`).
2. **IPA Notation**: Standard Korean IPA with syllable dots (e.g., `to.jun`, `ha.ɾaŋ`, `jun.sʰɯl.bi`).

### Step 2: Cultural & Poetic Translations
Translate the poetic meaning into nuanced, aesthetic prose appropriate for each language:
- **en**: Lyrical, uplifting prose focusing on harmony, virtue, and grace.
- **hi (Hindi)**: Respectful, profound phrasing in Devanagari script (e.g. शुभ, प्रकाश, समृद्धि, शांति).
- **ja (Japanese)**: Elegant, serene expressions blending Kanji nuance and seasonal beauty.
- **zh (Chinese)**: Classical four-character idioms or classical lyrical phrasing.
- **es (Spanish)**: Warm, romantic, and poetic cadence.
- **vi (Vietnamese)**: Sino-Vietnamese resonant poetic terms.

### Step 3: Execute Insertion
You can either run the automated helper script or edit the files directly:

```bash
node scripts/add_multilingual_name.mjs \
  --name "도윤" \
  --hanja "道允" \
  --roman "Do-yun" \
  --ipa "to.jun" \
  --en "A person of integrity who walks their own righteous path and earns trust with true light" \
  --hi "सत्य और धर्म के मार्ग पर चलकर अपने सच्चे प्रकाश से विश्वास जीतने वाला व्यक्ति" \
  --ja "自らの正しい道を歩み、真実の光で信頼を得る人" \
  --zh "踏上正义坦途，以真诚之光赢得世人信赖之人" \
  --es "Aquel que camina por un sendero recto y gana confianza con una luz sincera" \
  --vi "Người bước đi trên con đường chính đạo và tạo dựng niềm tin bằng ánh sáng chân thành"
```

### Step 4: Verification & Web Build
1. Validate JSON syntax across all language pack files.
2. Run `node scripts/build_web.mjs` to synchronize `dist/data/i18n/`.
3. Confirm that the new name is served across all language environments.
