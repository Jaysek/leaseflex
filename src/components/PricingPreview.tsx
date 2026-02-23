import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

function getPrice(rent: number): number {
  const effectiveRent = Math.min(rent, 15000);
  const netPayout = Math.max(0, effectiveRent - 750);
  return Math.max(9, Math.ceil(netPayout * 0.0155));
}

const examples = [
  {
    rent: 2500,
    label: '$2,500/mo rent',
    description: 'Studios & 1-bedrooms in most cities.',
    features: [
      'Coverage up to 1x monthly rent',
      '$750 deductible',
      'Coverage starts after 60 days',
      '1 covered claim per lease',
    ],
    popular: false,
  },
  {
    rent: 4000,
    label: '$4,000/mo rent',
    description: 'Our most common renter. 1–2 bedrooms in major metros.',
    features: [
      'Coverage up to 1x monthly rent',
      '$750 deductible',
      'Coverage starts after 60 days',
      '1 covered claim per lease',
      'Faster payouts',
    ],
    popular: true,
  },
  {
    rent: 8000,
    label: '$8,000/mo rent',
    description: 'Premium apartments & luxury leases.',
    features: [
      'Coverage up to 1x monthly rent',
      '$750 deductible',
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
            Pricing that scales with your rent
          </h2>
          <p className="mt-3 text-neutral-500">
            Your price is calculated from your exact rent. Same coverage for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((ex) => {
            const price = getPrice(ex.rent);
            return (
              <div
                key={ex.rent}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  ex.popular
                    ? 'tier-highlight text-white ring-1 ring-white/10 shadow-xl scale-[1.02]'
                    : 'border border-neutral-100 bg-white'
                }`}
              >
                {ex.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-neutral-900 text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-sm">
                    Most common
                  </div>
                )}

                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${ex.popular ? 'text-neutral-400' : 'text-neutral-400'}`}>
                  {ex.label}
                </p>
                <p className={`text-xs mb-6 ${ex.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {ex.description}
                </p>

                <div className="mb-6">
                  <span className={`text-4xl font-semibold tabular-nums ${ex.popular ? 'text-white' : 'text-neutral-900'}`}>
                    ${price}
                  </span>
                  <span className={`text-sm ${ex.popular ? 'text-neutral-400' : 'text-neutral-400'}`}>
                    /mo
                  </span>
                </div>

                <p className={`text-xs font-medium uppercase tracking-wider mb-4 ${ex.popular ? 'text-neutral-400' : 'text-neutral-400'}`}>
                  Up to ${ex.rent.toLocaleString()} coverage
                </p>

                <div className={`pt-6 border-t flex-1 ${ex.popular ? 'border-white/10' : 'border-neutral-100'}`}>
                  <div className="space-y-3">
                    {ex.features.map((feature) => (
                      <div
                        key={feature}
                        className={`flex items-center gap-2 text-sm ${
                          ex.popular ? 'text-neutral-300' : 'text-neutral-600'
                        }`}
                      >
                        <Check className={`w-4 h-4 shrink-0 ${ex.popular ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/offer"
                  className={`mt-8 group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full transition-all ${
                    ex.popular
                      ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  Get your price
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-10 text-sm text-neutral-500">
          Your exact price is calculated from your rent. These are examples — get your real quote in 60 seconds.
        </p>
        <p className="text-center mt-2 text-[11px] text-neutral-400">
          Covered reasons only &middot; Not all leases qualify &middot; See terms for details
        </p>
      </div>
    </section>
  );
}
