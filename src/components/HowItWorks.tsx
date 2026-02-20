import { Upload, Sparkles, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload your lease',
    description: 'Drop your PDF or enter details manually. Either way, takes under a minute.',
    accent: 'bg-violet-50 text-violet-600 border-violet-100',
    number: 'bg-violet-600',
  },
  {
    icon: Sparkles,
    title: 'We analyze it instantly',
    description: 'Our AI reads your lease in seconds — parsing clauses, penalties, and terms to price your flexibility.',
    accent: 'bg-sky-50 text-sky-600 border-sky-100',
    number: 'bg-sky-600',
  },
  {
    icon: ShieldCheck,
    title: 'Walk away when you want',
    description: 'Activate protection with one click. When life changes, you\'re covered.',
    accent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    number: 'bg-emerald-600',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Three steps to flexibility
          </h2>
          <p className="mt-3 text-neutral-500">
            No paperwork. No phone calls. Just protection.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Connector line — visible on desktop only */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-neutral-200" />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              {/* Numbered icon */}
              <div className="relative inline-flex flex-col items-center">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${step.accent} mb-2`}
                >
                  <step.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div
                  className={`w-6 h-6 rounded-full ${step.number} text-white text-xs font-bold flex items-center justify-center -mt-4 relative z-10 ring-4 ring-white`}
                >
                  {i + 1}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 mt-3 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
