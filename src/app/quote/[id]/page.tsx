'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import QuoteCard from '@/components/QuoteCard';
import { Loader2, Check, PartyPopper } from 'lucide-react';
import type { OfferPayload } from '@/lib/types';
import Link from 'next/link';

export default function QuotePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState<OfferPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const checkoutSuccess = searchParams.get('checkout') === 'success';

  useEffect(() => {
    // Try to load from sessionStorage first (set during form submission)
    const stored = sessionStorage.getItem('leaseflex_offer');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as OfferPayload;
        if (parsed.id === params.id) {
          setOffer(parsed);
          setLoading(false);
          return;
        }
      } catch {
        // fall through
      }
    }

    // If no matching offer in session, show fallback
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Offer not found</h2>
        <p className="text-sm text-neutral-500 mb-6">
          This offer may have expired or the link is invalid.
        </p>
        <Link
          href="/offer"
          className="px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
        >
          Get a new offer
        </Link>
      </div>
    );
  }

  if (checkoutSuccess) {
    return (
      <section className="min-h-screen bg-neutral-50">
        <div className="max-w-2xl mx-auto px-6 py-24">
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-8 text-center py-16">
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
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header — the emotional unlock */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-emerald-600 mb-3 tracking-wide uppercase">
            You&apos;re approved
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">
            Exit this lease for ${offer.monthly_price}/mo.
          </h1>
          <p className="mt-3 text-lg text-neutral-500">
            That&apos;s the cost of never feeling trapped again.
          </p>
          {offer.address && (
            <p className="mt-2 text-sm text-neutral-400">
              {offer.address}, {offer.city}, {offer.state}
            </p>
          )}
        </div>

        {/* Quote Card */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-8">
          <QuoteCard offer={offer} />
        </div>
      </div>
    </section>
  );
}
