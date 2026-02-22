const cities = [
  { city: 'New York', emoji: '\u{1F5FD}', range: '$6,000 \u2013 $18,000' },
  { city: 'San Francisco', emoji: '\u{1F301}', range: '$7,000 \u2013 $20,000' },
  { city: 'Miami', emoji: '\u{1F334}', range: '$5,000 \u2013 $15,000' },
  { city: 'Austin', emoji: '\u{1F920}', range: '$4,000 \u2013 $12,000' },
];

export default function CityPenalties() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            Real data
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Typical lease penalties we see
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cities.map((c) => (
            <div
              key={c.city}
              className="bg-white rounded-xl border border-neutral-100 p-5 text-center"
            >
              <span className="text-2xl mb-2 block">{c.emoji}</span>
              <p className="text-sm font-semibold text-neutral-900 mb-1">{c.city}</p>
              <p className="text-sm text-neutral-500 tabular-nums">{c.range}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
