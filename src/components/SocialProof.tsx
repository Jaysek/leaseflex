import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'Got a job offer in Austin. Broke my NYC lease with zero stress. LeaseFlex paid the $8k penalty.',
    name: 'Sarah K.',
    detail: 'Brooklyn \u2192 Austin',
    emoji: '\u{1F469}\u{1F3FC}',
  },
  {
    quote: 'I used to be afraid of signing 12-month leases. Now I sign without thinking twice.',
    name: 'Marcus D.',
    detail: 'San Francisco',
    emoji: '\u{1F468}\u{1F3FE}',
  },
  {
    quote: 'My landlord wanted three months rent to break the lease. LeaseFlex covered it in five days.',
    name: 'Priya M.',
    detail: 'Chicago \u2192 Denver',
    emoji: '\u{1F469}\u{1F3FD}',
  },
];

export default function SocialProof() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Testimonials */}
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            Social proof
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Renters who stopped being trapped
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-lg leading-none">
                  {t.emoji}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-400">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
