'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const EVENT_TYPES = [
  { value: 'job_relocation', label: 'Job relocation', description: 'Your employer is moving you to a different city.' },
  { value: 'job_loss', label: 'Job loss', description: 'You were laid off or terminated.' },
  { value: 'medical', label: 'Medical emergency', description: 'A medical condition requires you to relocate.' },
  { value: 'domestic_violence', label: 'Domestic violence', description: 'You need to leave for safety reasons.' },
  { value: 'other', label: 'Other qualifying event', description: 'Another documented life change.' },
];

export default function ClaimsPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'submitted'>('form');
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [claimId, setClaimId] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('leaseflex_email');
    if (stored) setEmail(stored);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!eventType || !eventDate || !description || !email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          event_type: eventType,
          event_date: eventDate,
          event_description: description,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setClaimId(data.claim_id);
        setStep('submitted');
      }
    } catch { /* fail silently */ }
    setLoading(false);
  }

  if (step === 'submitted') {
    return (
      <section className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-3">Claim submitted</h1>
          <p className="text-sm text-neutral-500 mb-2">
            We&apos;ve received your claim and will review it within 5 business days.
          </p>
          {claimId && (
            <p className="text-xs text-neutral-400 mb-8">Reference: {claimId.slice(0, 8).toUpperCase()}</p>
          )}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />Back to dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-lg mx-auto px-6 py-16">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />Back to dashboard
        </Link>

        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">File a claim</h1>
        <p className="text-sm text-neutral-400 mb-8">
          Tell us about the qualifying event that requires you to break your lease.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">What happened?</label>
            <div className="space-y-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setEventType(type.value)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                    eventType === type.value
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <p className="text-sm font-medium text-neutral-900">{type.label}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Event date */}
          <div>
            <label htmlFor="event-date" className="block text-sm font-medium text-neutral-700 mb-2">
              When did this happen?
            </label>
            <input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
              Describe your situation
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly explain what happened and why you need to break your lease..."
              className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !eventType || !eventDate || !description}
            className="w-full py-4 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Submit claim <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-[11px] text-neutral-400">
          Claims are reviewed within 5 business days. You may be asked for supporting documentation.
        </p>
      </div>
    </section>
  );
}
