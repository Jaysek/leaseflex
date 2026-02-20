'use client';

interface FlexScoreGaugeProps {
  score: number;
}

export default function FlexScoreGauge({ score }: FlexScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  const getColor = () => {
    if (clampedScore >= 70) return { ring: 'text-emerald-500', bg: 'bg-emerald-50', textColor: 'text-emerald-700', label: 'High mobility', percentile: 'Top 15% of renters' };
    if (clampedScore >= 50) return { ring: 'text-emerald-400', bg: 'bg-emerald-50', textColor: 'text-emerald-600', label: 'Good mobility', percentile: 'Top 30% of renters' };
    if (clampedScore >= 30) return { ring: 'text-amber-500', bg: 'bg-amber-50', textColor: 'text-amber-700', label: 'Moderate', percentile: 'Average flexibility' };
    return { ring: 'text-orange-500', bg: 'bg-orange-50', textColor: 'text-orange-700', label: 'Limited', percentile: 'Below average flexibility' };
  };

  const { ring, bg, textColor, label, percentile } = getColor();

  // SVG arc calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-neutral-100"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${ring} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-neutral-900">{clampedScore}</span>
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
            Mobility Score
          </span>
        </div>
      </div>
      <div className={`mt-3 px-3 py-1 rounded-full ${bg}`}>
        <span className={`text-xs font-medium ${textColor}`}>
          {label}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-neutral-400">
        {percentile}
      </p>
    </div>
  );
}
