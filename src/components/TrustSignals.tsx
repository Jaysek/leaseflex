import { X, Check } from 'lucide-react';

const comparisons = [
  { label: 'Sign up', old: 'Paper forms, phone calls', new: '2 minutes online' },
  { label: 'Get a quote', old: 'Days to weeks', new: 'Instant' },
  { label: 'Get approved', old: 'Manual review', new: 'AI-powered in seconds' },
  { label: 'File a claim', old: 'Lengthy paperwork', new: 'Submit online, done' },
  { label: 'Get paid', old: '30\u201390 days', new: '5 business days' },
  { label: 'Cancel', old: 'Call during business hours', new: 'One click, anytime' },
];

export default function TrustSignals() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Why renters choose LeaseFlex
          </h2>
          <p className="mt-3 text-neutral-500">
            The old way was slow, confusing, and full of paperwork. We fixed that.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <div />
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider text-center">
              Traditional
            </p>
            <p className="text-xs font-medium text-neutral-900 uppercase tracking-wider text-center">
              LeaseFlex
            </p>
          </div>

          {/* Rows */}
          {comparisons.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 px-6 py-4 items-center ${
                i < comparisons.length - 1 ? 'border-b border-neutral-50' : ''
              }`}
            >
              <p className="text-sm font-medium text-neutral-900">{row.label}</p>
              <div className="flex items-center justify-center gap-2">
                <X className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span className="text-sm text-neutral-400">{row.old}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-neutral-700">{row.new}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-[11px] text-neutral-400">
          Built in New York &middot; Powered by modern technology
        </p>
      </div>
    </section>
  );
}
