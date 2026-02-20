'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Check } from 'lucide-react';
import { track } from '@/lib/analytics';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    track('waitlist_joined');

    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // still show success — we don't want to block the UX
    }
    setSubmitted(true);
  };

  return (
    <footer className="border-t border-neutral-100 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Waitlist CTA */}
        <div className="mb-12 pb-10 border-b border-neutral-100">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              Join the waitlist
            </h3>
            <p className="text-sm text-neutral-500 mb-4">
              Be the first to know when LeaseFlex launches in your city.
            </p>
            {!submitted ? (
              <form onSubmit={handleWaitlist} className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 min-w-0 px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                />
                <button
                  type="submit"
                  className="shrink-0 inline-flex items-center gap-1.5 px-5 py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Notify me
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 py-3 text-sm text-emerald-600 font-medium">
                <Check className="w-4 h-4" />
                You&apos;re on the list. We&apos;ll be in touch.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-neutral-500">LeaseFlex</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-xs">
              Mobility protection for modern renters. Life changes — your lease flexes with you.
            </p>
          </div>
          <div className="flex gap-8 sm:gap-12 text-sm text-neutral-400">
            <div className="space-y-2">
              <p className="font-medium text-neutral-500">Product</p>
              <Link href="/#how-it-works" className="block hover:text-neutral-600 transition-colors">How it works</Link>
              <Link href="/#pricing" className="block hover:text-neutral-600 transition-colors">Pricing</Link>
              <Link href="/#coverage" className="block hover:text-neutral-600 transition-colors">Coverage</Link>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-neutral-500">Company</p>
              <Link href="/offer" className="block hover:text-neutral-600 transition-colors">Get your offer</Link>
              <Link href="/terms" className="block hover:text-neutral-600 transition-colors">Terms</Link>
              <Link href="/privacy" className="block hover:text-neutral-600 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-neutral-100 text-xs text-neutral-300">
          &copy; {new Date().getFullYear()} LeaseFlex. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
