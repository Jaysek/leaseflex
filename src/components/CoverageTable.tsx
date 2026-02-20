import { Check, X } from 'lucide-react';
import { COVERED_ITEMS, NOT_COVERED_ITEMS } from '@/lib/constants';

export default function CoverageTable() {
  return (
    <section id="coverage" className="py-24 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            We cover what traps you.
          </h2>
          <p className="mt-3 text-neutral-500">
            The financial penalties that keep you stuck. Nothing else.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Covered */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-600 mb-6">
              Covered
            </h3>
            <ul className="space-y-4">
              {COVERED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Covered */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-6">
              Not covered
            </h3>
            <ul className="space-y-4">
              {NOT_COVERED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center">
                    <X className="w-3 h-3 text-neutral-400" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-neutral-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
