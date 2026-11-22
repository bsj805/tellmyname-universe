// src/components/AdSenseBanner.tsx
"use client";
import React, { useEffect } from "react";

interface AdSenseBannerProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle";
  layoutKey?: string;
  minHeight?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Google AdSense 반응형 광고 컴포넌트
 * - minHeight 컨테이너를 사전 예약하여 Core Web Vitals (CLS: Cumulative Layout Shift) 감점을 방지합니다.
 * - 검색엔진 친화적 UX 및 AdSense 정책(콘텐츠와 광고의 명확한 구분)을 준수합니다.
 */
export default function AdSenseBanner({
  adSlot,
  adFormat = "auto",
  layoutKey,
  minHeight = "120px",
  label = "SPONSORED · AD",
}: AdSenseBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push error:", err);
    }
  }, [adSlot]);

  return (
    <aside
      aria-label="광고 영역"
      className="my-6 w-full rounded-2xl border border-amber-200/70 bg-amber-50/40 p-3 text-center"
      style={{ minHeight }}
    >
      <div className="mb-1 text-[10px] font-semibold tracking-widest text-stone-400 uppercase">
        {label}
      </div>
      <ins
        className="adsbygoogle block"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </aside>
  );
}
