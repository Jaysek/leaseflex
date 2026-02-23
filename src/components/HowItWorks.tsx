import Link from 'next/link';
import { Upload, Sparkles, ShieldCheck, ArrowRight, ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload your lease',
    description: 'Drop your lease PDF or enter a few details. Takes under 60 seconds.',
    detail: 'We support all standard residential leases',
    accent: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    text: 'text-violet-600',
    glow: 'shadow-violet-500/10',
  },
  {
    icon: Sparkles,
    title: 'Get your offer instantly',
    description: 'We read your lease and calculate exactly what you\'d owe if you left early. Your personalized price shows up in seconds.',
    detail: 'AI-powered analysis, no waiting',
    accent: 'from-sky-500 to-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    text: 'text-sky-600',
    glow: 'shadow-sky-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Walk away protected',
    description: 'When life changes, let us know. LeaseFlex pays the early termination fees so you don\'t have to.',
    detail: 'Money in your account in 5 business days',
    accent: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-600',
    glow: 'shadow-emerald-500/10',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-3">
            3 simple steps
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900">
            How it works
          </h2>
          <p className="mt-4 text-lg text-neutral-500 max-w-lg mx-auto">
            Get covered in under 2 minutes. File a claim online when you need it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-2xl border ${step.border} p-8 shadow-sm ${step.glow} hover:shadow-md transition-shadow`}
            >
              {/* Icon with step number badge */}
              <div className="relative inline-flex mb-6">
                <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${step.bg} ${step.text}`}>
                  <step.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${step.accent} text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white`}>
                  {i + 1}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                {step.description}
              </p>
              <p className="text-xs italic text-neutral-400 flex items-center gap-1">
                {step.detail}
              </p>

              {/* Arrow connector (between cards on desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-sand-dark items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-neutral-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/offer"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 transition-all"
          >
            See if my lease qualifies
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="mt-3 text-xs text-neutral-400">
            Free to check &middot; No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
