'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QuoteCard from '@/components/QuoteCard';
import { Loader2 } from 'lucide-react';
import type { OfferPayload } from '@/lib/types';
import Link from 'next/link';

export default function QuotePage() {
  const params = useParams();
  const [offer, setOffer] = useState<OfferPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffer() {
      // Try sessionStorage first (set during form submission)
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
          // fall through to API
        }
      }

      // Fetch from API
      try {
        const res = await fetch(`/api/offer/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOffer(data);
          setLoading(false);
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

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header — emotional anchor */}
        <div className="text-center mb-10">
          <p className="text-sm italic text-neutral-400 mb-4">
            You&apos;re approved
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 leading-tight">
            {offer.full_name ? `${offer.full_name.split(' ')[0]}, your` : 'Your'} liability if you leave early is up to ${(offer.months_remaining * offer.monthly_rent).toLocaleString()}.
          </h1>
          {offer.address && (
            <p className="mt-3 text-sm text-neutral-400">
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
