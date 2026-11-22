// src/lib/gemini_client.js — Shared Gemini Multimodal Prompt & Artwork Client for MyCar (car.tellmyname.app)
// Supports live Gemini API when GEMINI_API_KEY is present, plus deterministic 1024x1024 SVG artwork & appraisal synthesis.

import { lookupCarByLevel } from './master_dataset.js';
import {
  getCarConceptByLevel,
  getJobConceptByLevel,
  getHouseConceptByLevel,
  renderCarArtworkSvg,
  renderJobArtworkSvg,
  renderHouseArtworkSvg,
  getCarArtworkSvgDataUri,
  getJobArtworkSvgDataUri,
  getHouseArtworkSvgDataUri
} from './taxonomy.js';

export const GEMINI_MODEL_ID =
  (typeof process !== 'undefined' && process.env && process.env.GEMINI_MODEL) || 'gemini-3.8-flash';

export {
  getCarConceptByLevel,
  getJobConceptByLevel,
  getHouseConceptByLevel,
  renderCarArtworkSvg,
  renderJobArtworkSvg,
  renderHouseArtworkSvg,
  getCarArtworkSvgDataUri,
  getJobArtworkSvgDataUri,
  getHouseArtworkSvgDataUri
};

/**
 * 자동차·탈것 AI 이미지 생성을 위한 표준 영문 시각 프롬프트를 생성합니다 (텍스트/글자/워터마크 엄격 배제).
 * @param {object} concept
 * @returns {string}
 */
export function buildCarImagePrompt(concept) {
  const c = concept && typeof concept === 'object' ? concept : lookupCarByLevel(0);
  if (c.imagePrompt && String(c.imagePrompt).trim().length > 20) {
    return String(c.imagePrompt).trim();
  }
  const enTitle = c.en?.title || c.title || `Level ${c.level} Extreme Vehicle`;
  const isGood = c.zone === 'GOOD' || Number(c.level) >= 500;
  const mood = isGood
    ? 'epic awe-inspiring luxury or heroic majesty, dazzling dramatic lighting, cinematic composition'
    : 'chaotic comedic slapstick atmosphere, exaggerated cartoonish dynamic action, expressive details';

  return `Vibrant stylized digital illustration of ${enTitle}, ${mood}, rich vivid colors, ultra-detailed vehicle and ride concept art, strictly no text, no letters, no words, no numbers, no logos, no watermarks in the image.`;
}

/**
 * Gemini AI 시승 감정서 JSON 생성을 위한 프롬프트를 빌드합니다.
 * @param {object} concept
 * @returns {string}
 */
export function buildCarAppraisalPrompt(concept) {
  const c = concept && typeof concept === 'object' ? concept : lookupCarByLevel(0);
  const realityDesc = c.realityType === 'REAL'
    ? '실제·역사 속 실존 탈것·생물 라이딩'
    : '허구·마법 빗자루·판타지·SF 탈것';
  return `당신은 기상천외하고 유쾌한 다중우주 수석 정비사 및 시승 감정사입니다.
단계: Lv.${c.level} (${realityDesc})
탈것명: ${c.title}
카테고리: ${c.categoryLabel || c.category}
다음 JSON 형식으로만 응답하세요:
{"era":"언제 타던 탈것인지(연식·시대)","estimatedPrice":"추산되는 차량 가격·유지비","specialFeature":"탈것의 특별한 기능이나 주행 성능(황당하고 웃기게 2~3문장)","aiVerdict":"한 줄 AI 수석 정비사 총평"}`;
}

/**
 * Calls Gemini API if GEMINI_API_KEY is available, or returns enriched deterministic vehicle appraisal.
 * @param {object} concept
 * @param {string} [apiKey]
 * @returns {Promise<object>}
 */
export async function generateGeminiAppraisal(
  concept,
  apiKey = (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined)
) {
  const base = concept || lookupCarByLevel(0);
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_ID}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildCarAppraisalPrompt(base) }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          const era = parsed.era || base.era;
          const estimatedPrice = parsed.estimatedPrice || base.estimatedPrice || base.estimatedSalary;
          const specialFeature = parsed.specialFeature || base.specialFeature || base.specialDuty;
          return {
            ...base,
            ...parsed,
            era,
            builtYear: era,
            estimatedPrice,
            estimatedSalary: estimatedPrice,
            estimatedValue: estimatedPrice,
            specialFeature,
            specialDuty: specialFeature,
            model: GEMINI_MODEL_ID
          };
        }
      }
    } catch {
      // Fallback to deterministic appraisal below
    }
  }

  const era = base.era || base.builtYear || '동시대 및 다중우주';
  const estimatedPrice = base.estimatedPrice || base.estimatedSalary || base.estimatedValue || '측정 불가';
  const specialFeature = base.specialFeature || base.specialDuty || '상상을 초월하는 기상천외 주행 성능';

  return {
    ...base,
    era,
    builtYear: era,
    estimatedPrice,
    estimatedSalary: estimatedPrice,
    estimatedValue: estimatedPrice,
    specialFeature,
    specialDuty: specialFeature,
    imagePrompt: buildCarImagePrompt(base),
    model: GEMINI_MODEL_ID
  };
}

export const generateGemini38Appraisal = generateGeminiAppraisal;
