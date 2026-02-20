import { Check } from 'lucide-react';

export default function PricingPreview() {
  const tiers = [
    { range: '$1,500 – $3,000', price: '$12', popular: false },
    { range: '$3,000 – $6,000', price: '$20', popular: true },
    { range: '$6,000 – $10,000', price: '$35', popular: false },
    { range: '$10,000+', price: 'From $50', popular: false },
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-neutral-500">
            One monthly fee. Based on your rent. That&apos;s it.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.range}
              className={`relative group rounded-2xl p-6 text-center transition-all ${
                tier.popular
                  ? 'tier-highlight text-white ring-1 ring-white/10 scale-[1.02] shadow-xl'
                  : 'border border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-sm'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-neutral-900 text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-sm">
                  Most popular
                </div>
              )}

              <p
                className={`text-xs font-medium mb-3 uppercase tracking-wider ${
                  tier.popular ? 'text-neutral-400' : 'text-neutral-400'
                }`}
              >
                Monthly rent
              </p>
              <p
                className={`text-sm font-medium mb-4 ${
                  tier.popular ? 'text-white' : 'text-neutral-700'
                }`}
              >
                {tier.range}
              </p>
              <div
                className={`pt-4 border-t ${
                  tier.popular ? 'border-white/10' : 'border-neutral-100'
                }`}
              >
                <span
                  className={`text-3xl font-semibold ${
                    tier.popular ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {tier.price}
                </span>
                <span
                  className={`text-sm ${
                    tier.popular ? 'text-neutral-400' : 'text-neutral-400'
                  }`}
                >
                  /mo
                </span>
              </div>

              {tier.popular && (
                <div className="mt-4 flex flex-col gap-1.5">
                  {['Coverage up to $15k', '$500 deductible', '60-day activation'].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center gap-1.5 text-xs text-neutral-300 justify-center"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        {item}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-xs text-neutral-400">
          $500 deductible &middot; Coverage cap up to $30,000 &middot; Max $99/month
        </p>
      </div>
    </section>
  );
}
