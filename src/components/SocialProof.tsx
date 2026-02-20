import { Shield, TrendingUp, Users, Star } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '2,400+',
    label: 'Renters protected',
  },
  {
    icon: TrendingUp,
    value: '$4.2M',
    label: 'In coverage issued',
  },
  {
    icon: Shield,
    value: '98%',
    label: 'Claims approved',
  },
];

const testimonials = [
  {
    quote: 'Got a job offer in Austin. Broke my NYC lease with zero stress. LeaseFlex paid the $8k penalty.',
    name: 'Sarah K.',
    detail: 'Brooklyn, NY → Austin, TX',
    initials: 'SK',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    quote: 'I was month-to-month anxious for years. Now I sign 12-month leases without thinking twice.',
    name: 'Marcus D.',
    detail: 'San Francisco, CA',
    initials: 'MD',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    quote: 'My landlord wanted 3 months rent to break. LeaseFlex covered it in 5 business days.',
    name: 'Priya M.',
    detail: 'Chicago, IL → Denver, CO',
    initials: 'PM',
    color: 'bg-emerald-100 text-emerald-700',
  },
];

export default function SocialProof() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 mb-3">
                <stat.icon className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-neutral-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            Real stories
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
              {/* Stars */}
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

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${t.color}`}
                >
                  {t.initials}
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
