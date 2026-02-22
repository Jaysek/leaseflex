'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QuoteCard from '@/components/QuoteCard';
import { Loader2, ShieldCheck } from 'lucide-react';
import type { OfferPayload } from '@/lib/types';
import Link from 'next/link';

export default function QuotePage() {
  const params = useParams();
  const [offer, setOffer] = useState<OfferPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    async function loadOffer() {
      const stored = sessionStorage.getItem('leaseflex_offer');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as OfferPayload;
          if (parsed.id === params.id) {
            setOffer(parsed);
            setLoading(false);
            setTimeout(() => setRevealed(true), 100);
            return;
          }
        } catch {
          // fall through to API
        }
      }

      try {
        const res = await fetch(`/api/offer/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOffer(data);
          setLoading(false);
          setTimeout(() => setRevealed(true), 100);
          return;
        }
      } catch {
        // fall through
      }

      setLoading(false);
    }

    loadOffer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
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

  const firstName = offer.full_name ? offer.full_name.split(' ')[0] : null;

  return (
    <>
      {/* Dark hero with price reveal */}
      <section className="relative bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto px-6 pt-20 pb-24 text-center">
          {/* Approved badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              {firstName ? `${firstName}, you\u2019re approved` : 'You\u2019re approved'}
            </span>
          </div>

          {/* Price — the hero moment */}
          <div className={`transition-all duration-1000 delay-200 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-sm text-neutral-500 uppercase tracking-widest mb-4">
              Your monthly rate
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-7xl sm:text-8xl font-bold tracking-tighter text-white tabular-nums">
                ${offer.monthly_price}
              </span>
              <span className="text-2xl text-neutral-500 font-light">/mo</span>
            </div>
          </div>

          {/* Address */}
          <div className={`mt-6 transition-all duration-700 delay-500 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
            {offer.address && (
              <p className="text-sm text-neutral-500">
                {offer.address}, {offer.city}, {offer.state}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Card body */}
      <section className="bg-neutral-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-6 -mt-4">
          <div className={`bg-white rounded-2xl border border-neutral-200/60 shadow-xl shadow-neutral-900/5 p-6 sm:p-8 transition-all duration-700 delay-300 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <QuoteCard offer={offer} />
          </div>
          <div className="h-20" />
        </div>
      </section>
    </>
  );
}
