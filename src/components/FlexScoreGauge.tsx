'use client';

import { useEffect, useState, useRef } from 'react';

interface FlexScoreGaugeProps {
  score: number; // 0–100
}

export default function FlexScoreGauge({ score }: FlexScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const [animated, setAnimated] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const start = performance.now();
          const duration = 1000;

          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimated(Math.round(eased * clampedScore));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [clampedScore]);

  const label = clampedScore >= 70 ? 'Excellent' : clampedScore >= 50 ? 'Good' : clampedScore >= 30 ? 'Fair' : 'Low';

  // Arc: 180° semicircle
  const radius = 54;
  const circumference = Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <svg width="140" height="82" viewBox="0 0 140 82" className="overflow-visible">
        {/* Background arc */}
        <path
          d="M 10 72 A 54 54 0 0 1 130 72"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d="M 10 72 A 54 54 0 0 1 130 72"
          fill="none"
          stroke="#171717"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="-mt-11 text-center">
        <p className="text-3xl font-bold text-neutral-900 tabular-nums">{animated}</p>
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
