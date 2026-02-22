'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Shield,
  ShieldX,
  ShieldCheck,
  Clock,
  DollarSign,
  AlertTriangle,
  Phone,
  Check,
  X,
  Loader2,
  Mail,
  ChevronDown,
  Send,
  Calendar,
} from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import { COVERED_ITEMS, NOT_COVERED_ITEMS } from '@/lib/constants';
import type { OfferPayload } from '@/lib/types';
import { track } from '@/lib/analytics';

interface QuoteCardProps {
  offer: OfferPayload;
}

export default function QuoteCard({ offer }: QuoteCardProps) {
  const [step, setStep] = useState<'quote' | 'capture' | 'confirmed'>('quote');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [step]);

  const handleStartProtection = () => {
    track('start_protection_clicked', { offer_id: offer.id, monthly_price: offer.monthly_price });
    setStep('capture');
  };

  const handleSubmit = async () => {
    if (!email || !name) return;
    track('protection_submitted', { offer_id: offer.id, monthly_price: offer.monthly_price, city: offer.city });
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          offer_id: offer.id,
          monthly_price: offer.monthly_price,
          flex_score: offer.flex_score,
          coverage_cap: offer.coverage_cap,
          city: offer.city,
          state: offer.state,
        }),
      });
    } catch { /* still show confirmation */ }
    setLoading(false);
    setStep('confirmed');
  };

  const handleEmailQuote = async () => {
    if (!emailInput) return;
    track('email_quote_clicked', { offer_id: offer.id });
    setEmailSending(true);
    try {
      await fetch('/api/email-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer_id: offer.id, email: emailInput,
          monthly_price: offer.monthly_price, coverage_cap: offer.coverage_cap,
          city: offer.city, state: offer.state, address: offer.address,
        }),
      });
      setEmailSent(true);
    } catch { /* fail silently */ }
    setEmailSending(false);
  };

  const totalLiability = offer.months_remaining * offer.monthly_rent;
  const terminationFee = offer.termination_fee_amount || 0;
  const totalExposure = totalLiability + terminationFee;
  const annualCost = offer.monthly_price * Math.min(offer.months_remaining, 12);

  const faqs = [
    { q: 'What counts as a qualifying event?', a: 'Job relocation, job loss, medical emergency, domestic violence, or other documented life changes that require you to break your lease.' },
    { q: 'When does my coverage start?', a: `Coverage activates after the ${offer.waiting_period_days}-day waiting period. After that, you\u2019re covered for any qualifying event through the end of your lease.` },
    { q: 'How do I file a claim?', a: 'File online through your LeaseFlex account. We review and process claims within 5 business days.' },
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel with no penalties. Your coverage ends at the end of the current billing period.' },
  ];

  const waitingDate = new Date();
  waitingDate.setDate(waitingDate.getDate() + offer.waiting_period_days);

  // ─── Confirmed ───
  if (step === 'confirmed') {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-3">
          You&apos;re on the list
        </h2>
        <p className="text-neutral-500 max-w-sm mx-auto mb-2">
          LeaseFlex isn&apos;t live yet, but you&apos;ll be the first to know when we launch{offer.city ? ` in ${offer.city}` : ''}.
        </p>
        <p className="text-sm text-neutral-400 mb-8">
          We&apos;ll reach out to {email} as soon as it&apos;s ready.
        </p>
        <div className="inline-flex flex-col gap-3 min-w-[240px]">
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-xl">
            <span className="text-sm text-neutral-500">Your rate</span>
            <span className="text-sm font-semibold text-neutral-900">${offer.monthly_price}/mo</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-xl">
            <span className="text-sm text-neutral-500">Coverage</span>
            <span className="text-sm font-semibold text-neutral-900">Up to ${offer.coverage_cap.toLocaleString()}</span>
          </div>
        </div>
        <p className="mt-6 text-xs text-neutral-400">No card was charged.</p>
      </div>
    );
  }

  // ─── Capture ───
  if (step === 'capture') {
    return (
      <div className="py-6">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">Almost there</h3>
          <p className="text-sm text-neutral-500">
            Enter your info to lock in <span className="font-semibold text-neutral-900">${offer.monthly_price}/mo</span>.
          </p>
        </div>
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoFocus
            className="px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent focus:bg-white transition-all" />
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent focus:bg-white transition-all" />
          <input type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent focus:bg-white transition-all" />
          <button onClick={handleSubmit} disabled={loading || !email || !name}
            className="mt-2 py-4 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (
              <span className="flex items-center justify-center gap-1.5">Start Protection<ArrowRight className="w-3.5 h-3.5" /></span>
            )}
          </button>
          <button onClick={() => setStep('quote')} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
            Back to offer
          </button>
        </div>
        <p className="text-center mt-5 text-[11px] text-neutral-400">No credit card required</p>
      </div>
    );
  }

  // ─── Quote ───
  return (
    <>
      <div className="space-y-10">
        {/* Alert badges */}
        {(offer.requires_manual_review || offer.requires_concierge) && (
          <div className="flex flex-wrap gap-2">
            {offer.requires_manual_review && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />Manual review required
              </div>
            )}
            {offer.requires_concierge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                <Phone className="w-3.5 h-3.5" />Concierge review
              </div>
            )}
          </div>
        )}

        {/* ── Risk comparison ── */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            {/* WITHOUT */}
            <div className="relative rounded-2xl bg-gradient-to-b from-red-50 to-red-50/30 border border-red-100 p-5 sm:p-6">
              <div className="flex items-center gap-1.5 mb-6">
                <ShieldX className="w-4 h-4 text-red-400" />
                <span className="text-[11px] font-semibold text-red-400 uppercase tracking-widest">
                  Without
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-red-600 tabular-nums tracking-tight">
                <AnimatedNumber value={totalExposure} prefix="$" locale />
              </p>
              <div className="mt-4 space-y-1.5">
                <p className="text-xs text-red-400/80">
                  {offer.months_remaining} mo &times; ${offer.monthly_rent.toLocaleString()} rent
                </p>
                {terminationFee > 0 && (
                  <p className="text-xs text-red-400/80">
                    + ${terminationFee.toLocaleString()} termination fee
                  </p>
                )}
              </div>
              <p className="mt-4 text-[11px] font-medium text-red-500 uppercase tracking-wider">
                Your risk
              </p>
            </div>

            {/* WITH */}
            <div className="relative rounded-2xl bg-gradient-to-b from-emerald-50 to-emerald-50/30 border-2 border-emerald-500 p-5 sm:p-6">
              <div className="absolute -top-3 right-4">
                <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                  Protected
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-6">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-widest">
                  With LeaseFlex
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-emerald-600 tabular-nums tracking-tight">
                <AnimatedNumber value={annualCost} prefix="$" locale />
              </p>
              <p className="mt-4 text-xs text-emerald-500/80">
                ${offer.monthly_price}/mo &times; {Math.min(offer.months_remaining, 12)} months
              </p>
              <p className="mt-4 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Save ${(totalExposure - annualCost).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ── Plan details ── */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
            Your plan
          </h3>
          <div className="grid grid-cols-4 gap-px bg-neutral-100 rounded-2xl overflow-hidden">
            <div className="bg-white p-4 sm:p-5 text-center">
              <Shield className="w-4 h-4 text-neutral-300 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-neutral-900 tabular-nums">
                ${offer.coverage_cap.toLocaleString()}
              </p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Coverage</p>
            </div>
            <div className="bg-white p-4 sm:p-5 text-center">
              <DollarSign className="w-4 h-4 text-neutral-300 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-neutral-900">
                ${offer.deductible}
              </p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Deductible</p>
            </div>
            <div className="bg-white p-4 sm:p-5 text-center">
              <Clock className="w-4 h-4 text-neutral-300 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-neutral-900">
                {offer.waiting_period_days}d
              </p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Waiting</p>
            </div>
            <div className="bg-white p-4 sm:p-5 text-center">
              <Calendar className="w-4 h-4 text-neutral-300 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-neutral-900">
                {waitingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Active</p>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div>
          <button
            ref={ctaRef}
            onClick={handleStartProtection}
            className="w-full py-4 bg-neutral-900 text-white font-medium rounded-2xl hover:bg-neutral-800 shadow-lg shadow-neutral-900/10 transition-all group"
          >
            <span className="flex items-center justify-center gap-2 text-sm">
              Start Protection — ${offer.monthly_price}/mo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
          <p className="text-center mt-3 text-[11px] text-neutral-400">
            No credit card required &middot; Cancel anytime
          </p>
        </div>

        {/* ── Coverage ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100 p-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600 mb-4">Covered</h4>
            <ul className="space-y-2.5">
              {COVERED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-300 mb-4">Not covered</h4>
            <ul className="space-y-2.5">
              {NOT_COVERED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-400">
                  <X className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">Questions</h3>
          <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50/50 transition-colors">
                  <span className="text-sm font-medium text-neutral-700">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 flex-shrink-0 ml-4 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Email quote ── */}
        <div className="text-center">
          {emailSent ? (
            <p className="text-sm text-neutral-500">
              <Check className="w-3.5 h-3.5 inline-block mr-1 text-emerald-500" />Sent to {emailInput}
            </p>
          ) : showEmailCapture ? (
            <div className="flex items-center gap-2 max-w-sm mx-auto">
              <input type="email" placeholder="your@email.com" value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailQuote()} autoFocus
                className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow" />
              <button onClick={handleEmailQuote} disabled={emailSending || !emailInput}
                className="px-4 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors">
                {emailSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <button onClick={() => setShowEmailCapture(true)}
              className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
              <Mail className="w-3.5 h-3.5" />Email me this quote
            </button>
          )}
        </div>

        {/* Fine print */}
        <p className="text-center text-[11px] text-neutral-300 leading-relaxed">
          1 claim per lease &middot; {offer.requires_manual_review ? '180' : '60'}-day waiting period &middot; Qualifying events only
        </p>
      </div>

      {/* Sticky mobile CTA */}
      {showSticky && step === 'quote' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm border-t border-neutral-100 px-4 py-3 safe-area-inset-bottom">
          <button onClick={handleStartProtection}
            className="w-full py-3.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors">
            Start Protection — ${offer.monthly_price}/mo
          </button>
        </div>
      )}
    </>
  );
}
