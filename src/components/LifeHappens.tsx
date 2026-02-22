export default function LifeHappens() {
  const events = [
    { emoji: '\u{1F4E6}', text: 'New job in another city' },
    { emoji: '\u{1F494}', text: 'Breakup or relationship change' },
    { emoji: '\u{1F3E0}', text: 'Buying your first home' },
    { emoji: '\u{1F476}', text: 'Family needs change' },
    { emoji: '\u{1F393}', text: 'School or career shift' },
  ];

  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            Life happens
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Life moves faster than your lease.
          </h2>
          <p className="mt-4 text-neutral-500 max-w-lg mx-auto">
            People break leases because life moves fast.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
          {events.map((event) => (
            <div
              key={event.text}
              className="flex items-center gap-3 px-4 py-4 bg-white rounded-xl border border-neutral-100"
            >
              <span className="text-xl leading-none">{event.emoji}</span>
              <span className="text-sm text-neutral-700">{event.text}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center max-w-2xl mx-auto">
          <p className="text-neutral-500 mb-2">
            Without protection, renters pay thousands.
          </p>
          <p className="text-lg font-semibold text-neutral-900">
            With LeaseFlex, you walk away.
          </p>
        </div>
      </div>
    </section>
  );
}
