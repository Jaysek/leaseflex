import { AlertTriangle } from 'lucide-react';

export default function TheRealProblem() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            The real problem
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Breaking your lease can cost a fortune.
          </h2>
          <p className="mt-4 text-neutral-500 max-w-xl mx-auto">
            Most renters don&apos;t realize the risk until life forces a move.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Typical lease penalties include
            </h3>
          </div>

          <div className="space-y-3 mb-8">
            {[
              '2\u20133 months of rent',
              'Remaining rent obligations',
              'Early termination fees',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 px-4 py-3 bg-red-50/50 rounded-xl border border-red-100/50"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-sm text-neutral-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-neutral-100">
            <p className="text-lg text-neutral-700 mb-2">
              That can easily add up to <span className="font-semibold text-neutral-900">$5,000&ndash;$15,000.</span>
            </p>
            <p className="text-neutral-500">
              LeaseFlex turns that unpredictable penalty into a small monthly protection fee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
