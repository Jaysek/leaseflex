'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is this actually legit?',
    a: 'Yes. LeaseFlex is a financial protection product — like insurance for your lease flexibility. You pay a small monthly fee, and if you need to break your lease, we cover the penalties up to your coverage cap.',
  },
  {
    q: 'What happens when I need to break my lease?',
    a: 'File a claim through your dashboard. We verify the qualifying event, and once approved, we pay the early termination fees and remaining rent obligations directly — up to your coverage cap.',
  },
  {
    q: 'What counts as a qualifying event?',
    a: 'Job relocation (50+ miles), job loss, medical emergencies, domestic safety concerns, and military deployment. We cover the real reasons people need to move.',
  },
  {
    q: 'Is there a waiting period?',
    a: 'Yes — 60 days for most leases, 180 days if you have fewer than 6 months remaining. This prevents abuse and keeps prices low for everyone.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel month-to-month with no penalties. If you cancel, coverage ends at the end of your billing period.',
  },
  {
    q: 'Does my landlord need to know?',
    a: 'No. LeaseFlex is between you and us. Your landlord is not involved in the protection or claims process.',
  },
  {
    q: 'How is the monthly price calculated?',
    a: 'We analyze your rent amount, time remaining on your lease, whether subletting is allowed, and your early termination terms. More risk factors = slightly higher price, but it\'s always a fraction of your rent.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Questions? Answered.
          </h2>
          <p className="mt-3 text-neutral-500">
            Everything renters ask before they sign up.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-neutral-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-neutral-900 pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-neutral-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
