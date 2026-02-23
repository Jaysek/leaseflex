import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: '$19',
    coverage: 'Up to $3,000',
    description: 'Essential protection for lower-rent apartments.',
    features: [
      'Coverage up to 1x monthly rent',
      '$1,500 deductible',
      'Coverage starts after 60 days',
      '1 covered claim per lease',
    ],
    popular: false,
  },
  {
    name: 'Core',
    price: '$39',
    coverage: 'Up to $6,000',
    description: 'Our most popular plan. Full coverage for most renters.',
    features: [
      'Coverage up to 1x monthly rent',
      '$1,500 deductible',
      'Coverage starts after 60 days',
      '1 covered claim per lease',
      'Faster payouts',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$149',
    coverage: 'Up to $15,000',
    description: 'Maximum protection for high-rent leases.',
    features: [
      'Coverage up to 1x monthly rent',
      '$1,500 deductible',
      'Coverage starts after 60 days',
      '1 covered claim per lease',
      'Faster payouts',
      'Concierge support',
    ],
    popular: false,
  },
];

export default function PricingPreview() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-neutral-500">
            Choose the plan that matches your lease. No contracts. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                tier.popular
                  ? 'tier-highlight text-white ring-1 ring-white/10 shadow-xl scale-[1.02]'
                  : 'border border-neutral-100 bg-white'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-neutral-900 text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-sm">
                  Most popular
                </div>
              )}

              <p className={`text-sm font-semibold mb-1 ${tier.popular ? 'text-white' : 'text-neutral-900'}`}>
                {tier.name}
              </p>
              <p className={`text-xs mb-6 ${tier.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {tier.description}
              </p>

              <div className="mb-6">
                <span className={`text-4xl font-semibold ${tier.popular ? 'text-white' : 'text-neutral-900'}`}>
                  {tier.price}
                </span>
                <span className={`text-sm ${tier.popular ? 'text-neutral-400' : 'text-neutral-400'}`}>
                  /mo
                </span>
              </div>

              <p className={`text-xs font-medium uppercase tracking-wider mb-4 ${tier.popular ? 'text-neutral-400' : 'text-neutral-400'}`}>
                {tier.coverage} coverage
              </p>

              <div className={`pt-6 border-t flex-1 ${tier.popular ? 'border-white/10' : 'border-neutral-100'}`}>
                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div
                      key={feature}
                      className={`flex items-center gap-2 text-sm ${
                        tier.popular ? 'text-neutral-300' : 'text-neutral-600'
                      }`}
                    >
                      <Check className={`w-4 h-4 shrink-0 ${tier.popular ? 'text-emerald-400' : 'text-emerald-500'}`} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/offer"
                className={`mt-8 group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full transition-all ${
                  tier.popular
                    ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                Get started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-sm text-neutral-500">
          Your plan is based on your monthly rent. All plans cover the same reasons for leaving.
        </p>
        <p className="text-center mt-2 text-[11px] text-neutral-400">
          Covered reasons only &middot; Not all leases qualify &middot; See terms for details
        </p>
      </div>
    </section>
  );
}
