import { Check, X } from 'lucide-react';

const items = [
  { item: 'Early termination fees', covered: true },
  { item: 'Lease break penalties', covered: true },
  { item: 'Remaining rent you\'d owe', covered: true, note: 'Capped per plan' },
  { item: 'Moving costs', covered: false },
  { item: 'Security deposits', covered: false },
  { item: 'Property damages', covered: false },
  { item: 'Unpaid utilities', covered: false },
];

export default function CoverageTable() {
  return (
    <section id="coverage" className="py-24 bg-sand">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            What&apos;s covered
          </h2>
          <p className="mt-3 text-neutral-500">
            We cover the fees that make leaving expensive. Nothing more, nothing less.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-sand-dark overflow-hidden">
          {items.map((row, i) => (
            <div
              key={row.item}
              className={`flex items-center justify-between px-6 py-4 ${
                i < items.length - 1 ? 'border-b border-neutral-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {row.covered ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-neutral-300" strokeWidth={2.5} />
                  </div>
                )}
                <span className={`text-sm ${row.covered ? 'font-medium text-neutral-900' : 'text-neutral-400'}`}>
                  {row.item}
                </span>
              </div>
              {row.note && (
                <span className="text-[11px] text-neutral-400">{row.note}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
