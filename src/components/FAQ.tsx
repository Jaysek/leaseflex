'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is LeaseFlex?',
    a: 'LeaseFlex is a monthly subscription that covers the financial penalties of breaking your lease — termination fees, remaining rent obligations, and the costs that lead to collections and credit damage.',
  },
  {
    q: 'What happens if I need to break my lease?',
    a: 'Let us know and share some basic info about why you\'re leaving. LeaseFlex pays the penalties your landlord charges for breaking the lease, so you leave cleanly with no collections or credit damage.',
  },
  {
    q: 'What reasons are covered?',
    a: 'Common covered reasons include getting a new job in another city, buying a home, relationship changes, and other major life events.',
  },
  {
    q: 'Is there a waiting period?',
    a: 'Yes. There\'s a 60-day waiting period after you sign up before your coverage kicks in. This applies to all plans.',
  },
  {
    q: 'Does my landlord need to know?',
    a: 'No. LeaseFlex works independently of your landlord.',
  },
  {
    q: 'How is pricing calculated?',
    a: 'Your price is calculated from your exact rent — it scales smoothly, no fixed tiers. The higher your rent, the more coverage you get, so the price rises with it. Plans start at $9/month.',
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
