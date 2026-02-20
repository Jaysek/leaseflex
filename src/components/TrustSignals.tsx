import { Lock, Zap, HeartHandshake, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant underwriting',
    description:
      'Our AI prices your flexibility in under 10 seconds. No phone calls, no waiting rooms, no paperwork.',
  },
  {
    icon: BarChart3,
    title: 'Flex Score intelligence',
    description:
      'A proprietary 0–100 score that measures your lease flexibility. Know your risk before your landlord does.',
  },
  {
    icon: HeartHandshake,
    title: 'Claims in 5 business days',
    description:
      'When life changes, we pay fast. Submit your claim and get reimbursed — no fine print games.',
  },
  {
    icon: Lock,
    title: 'Bank-grade security',
    description:
      'Your lease data is encrypted end-to-end. We never share information with landlords or third parties.',
  },
];

export default function TrustSignals() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            Why LeaseFlex
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Built different from day one
          </h2>
          <p className="mt-3 text-neutral-500 max-w-lg mx-auto">
            Traditional insurance wasn&apos;t designed for renters. We are.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl border border-neutral-100 p-6 flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
