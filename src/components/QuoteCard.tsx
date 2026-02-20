'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Timer,
  Shield,
  Clock,
  DollarSign,
  AlertTriangle,
  Phone,
  Mail,
  Check,
  X,
  Loader2,
  PartyPopper,
} from 'lucide-react';
import FlexScoreGauge from './FlexScoreGauge';
import { COVERED_ITEMS, NOT_COVERED_ITEMS } from '@/lib/constants';
import type { OfferPayload } from '@/lib/types';
import { track } from '@/lib/analytics';

interface QuoteCardProps {
  offer: OfferPayload;
}

export default function QuoteCard({ offer }: QuoteCardProps) {
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartProtection = async () => {
    track('checkout_started', { offer_id: offer.id, monthly_price: offer.monthly_price });
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer_id: offer.id,
          monthly_price: offer.monthly_price,
          city: offer.city,
          state: offer.state,
        }),
      });
      const data = await res.json();
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      if (res.ok) {
        setCheckoutStarted(true);
      }
    } catch {
      // silent fail
    }
    setLoading(false);
  };

  const handleEmailOffer = async () => {
    if (!email) return;
    track('email_offer_sent', { offer_id: offer.id });
    setLoading(true);
    try {
      const res = await fetch('/api/email-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer_id: offer.id,
          email,
          monthly_price: offer.monthly_price,
          coverage_cap: offer.coverage_cap,
          city: offer.city,
          state: offer.state,
          address: offer.address,
        }),
      });
      if (res.ok) {
        setEmailSent(true);
        setShowEmail(false);
      }
    } catch {
      // silent fail for stub
    }
    setLoading(false);
  };

  // Confirmation screen — the BIG moment
  if (checkoutStarted) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-6">
          <PartyPopper className="w-10 h-10 text-emerald-600" />
        </div>
        <p className="text-sm font-medium text-emerald-600 mb-2 tracking-wide uppercase">
          It&apos;s done
        </p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-4 leading-tight">
          You&apos;re free now.
        </h2>
        <p className="text-lg text-neutral-500 max-w-md mx-auto mb-8">
          Your lease no longer controls your life. We&apos;ll be in touch within 24 hours to finalize everything.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Check className="w-4 h-4" />
          Protection activated
        </div>
      </div>
    );
  }

  const waitingDate = new Date();
  waitingDate.setDate(waitingDate.getDate() + offer.waiting_period_days);

  return (
    <div className="space-y-8">
      {/* Urgency + Badges */}
      <div className="flex flex-wrap gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-full text-xs font-medium">
          <Timer className="w-3.5 h-3.5" />
          Rate locked for 48 hours
        </div>
        {offer.requires_manual_review && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            Manual review required
          </div>
        )}
        {offer.requires_concierge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
            <Phone className="w-3.5 h-3.5" />
            Concierge review
          </div>
        )}
      </div>

      {/* Flex Score + Price */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <FlexScoreGauge score={offer.flex_score} />

        <div className="text-center md:text-left">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">
            Your monthly price
          </p>
          <div className="flex items-baseline gap-1 justify-center md:justify-start">
            <span className="text-5xl font-bold text-neutral-900">
              ${offer.monthly_price}
            </span>
            <span className="text-lg text-neutral-400">/mo</span>
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            {offer.city}, {offer.state} &middot; ${offer.monthly_rent.toLocaleString()}/mo rent
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-neutral-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-400">Coverage cap</span>
          </div>
          <p className="text-lg font-semibold text-neutral-900">
            ${offer.coverage_cap.toLocaleString()}
          </p>
        </div>

        <div className="bg-neutral-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-400">Deductible</span>
          </div>
          <p className="text-lg font-semibold text-neutral-900">
            ${offer.deductible}
          </p>
        </div>

        <div className="bg-neutral-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-400">Activation</span>
          </div>
          <p className="text-lg font-semibold text-neutral-900">
            {offer.waiting_period_days} days
          </p>
        </div>

        <div className="bg-neutral-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-400">Active from</span>
          </div>
          <p className="text-lg font-semibold text-neutral-900">
            {waitingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Coverage Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-neutral-100 rounded-xl p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-3">
            What traps you — covered
          </h4>
          <ul className="space-y-2">
            {COVERED_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-neutral-100 rounded-xl p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Not covered
          </h4>
          <ul className="space-y-2">
            {NOT_COVERED_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-neutral-400">
                <X className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTAs */}
      {offer.requires_concierge ? (
        <div className="bg-purple-50 rounded-2xl p-6 text-center">
          <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Premium concierge review
          </h3>
          <p className="text-sm text-neutral-500 mb-4">
            For high-value leases, our team provides a personalized review.
          </p>
          {!showEmail ? (
            <button
              onClick={() => setShowEmail(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Request concierge review
            </button>
          ) : (
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleEmailOffer}
                disabled={loading}
                className="px-5 py-3 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={handleStartProtection}
            disabled={loading}
            className="w-full group inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Start protection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {!emailSent ? (
            !showEmail ? (
              <button
                onClick={() => setShowEmail(true)}
                className="w-full py-3 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Email me this offer instead
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <button
                  onClick={handleEmailOffer}
                  disabled={loading || !email}
                  className="px-5 py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                </button>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-emerald-600">
              <Check className="w-4 h-4" />
              Offer sent to {email}
            </div>
          )}
        </div>
      )}

      {/* Urgency + Fine print */}
      <div className="text-center space-y-2">
        <p className="text-xs font-medium text-neutral-500">
          Rates may change based on demand. This offer expires in 48 hours.
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed">
          90-day minimum commitment &middot; 1 claim per lease term &middot;{' '}
          {offer.requires_manual_review ? '180-day' : '60-day'} waiting period applies
        </p>
      </div>
    </div>
  );
}
