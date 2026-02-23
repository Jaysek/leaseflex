import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function WhenItPaysForItself() {
  const scenarios = [
    {
      emoji: '\u{1F4BC}',
      title: 'Job relocation',
      without: '$8K\u2013$12K in fees + months of double rent',
      with: 'Leave clean. LeaseFlex pays.',
    },
    {
      emoji: '\u{1F3E0}',
      title: 'Buying a home',
      without: 'Penalties, remaining rent, or collections',
      with: 'Walk away with no financial damage',
    },
    {
      emoji: '\u{1F494}',
      title: 'Relationship change',
      without: 'Stuck paying rent you can\u2019t afford alone',
      with: 'Exit on your terms, credit intact',
    },
  ];

  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            The real cost of leaving isn&apos;t just the fee.
          </h2>
          <p className="mt-4 text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
            It&apos;s termination penalties, months of double rent, collections threats, and credit damage. One life change can follow you for years.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {scenarios.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col"
            >
              <span className="text-3xl mb-4">{s.emoji}</span>
              <h3 className="text-base font-semibold text-neutral-900 mb-6">
                {s.title}
              </h3>

              <div className="mt-auto space-y-0">
                <div className="py-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Without LeaseFlex</p>
                  <p className="text-sm font-medium text-neutral-600">{s.without}</p>
                </div>
                <div className="py-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">With LeaseFlex</p>
                  <p className="text-sm font-semibold text-neutral-900">{s.with}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-neutral-900 mb-8">
            LeaseFlex covers the fees, protects your credit, and lets you move on.
          </p>
          <Link
            href="/offer"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 transition-all"
          >
            See if your lease qualifies
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
