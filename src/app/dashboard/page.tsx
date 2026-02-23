'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Clock, FileText, ArrowRight, Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';

interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  offer: {
    monthly_price: number;
    coverage_cap: number;
    waiting_period_days: number;
    address: string;
    city: string;
    state: string;
    flex_score: number;
    months_remaining: number;
  };
}

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [claims, setClaims] = useState<{ id: string; status: string; event_type: string; created_at: string }[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('leaseflex_email');
    if (stored) {
      setEmail(stored);
      setAuthenticated(true);
      loadDashboard(stored);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadDashboard(userEmail: string) {
    try {
      const res = await fetch(`/api/dashboard?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription || null);
        setClaims(data.claims || []);
      }
    } catch { /* fail silently */ }
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    sessionStorage.setItem('leaseflex_email', email.toLowerCase().trim());
    setAuthenticated(true);
    setLoading(true);
    await loadDashboard(email.toLowerCase().trim());
  }

  function handleLogout() {
    sessionStorage.removeItem('leaseflex_email');
    setAuthenticated(false);
    setEmail('');
    setSubscription(null);
    setClaims([]);
  }

  if (!authenticated) {
    return (
      <section className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Welcome back</h1>
            <p className="text-sm text-neutral-400">Enter the email you used to sign up.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!email}
              className="w-full py-3.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              View my plan
            </button>
          </form>
          <p className="text-center mt-4 text-[11px] text-neutral-400">
            Don&apos;t have an account? <Link href="/offer" className="underline hover:text-neutral-600">Get an offer</Link>
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  const statusLabel = subscription?.status === 'active' ? 'Active' : subscription?.status === 'past_due' ? 'Past due' : subscription?.status === 'cancelled' ? 'Cancelled' : 'Waitlist';
  const statusColor = subscription?.status === 'active' ? 'bg-emerald-50 text-emerald-700' : subscription?.status === 'past_due' ? 'bg-amber-50 text-amber-700' : 'bg-neutral-100 text-neutral-500';

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Your plan</h1>
            <p className="text-sm text-neutral-400 mt-1">{email}</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" />Sign out
          </button>
        </div>

        {/* Status card */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-neutral-900" />
              <span className="text-sm font-semibold text-neutral-900">LeaseFlex Protection</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {statusLabel}
            </span>
          </div>

          {subscription?.offer ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="py-3 border-b border-neutral-100">
                <p className="text-xs text-neutral-400 mb-1">Monthly rate</p>
                <p className="text-lg font-semibold text-neutral-900">${subscription.offer.monthly_price}/mo</p>
              </div>
              <div className="py-3 border-b border-neutral-100">
                <p className="text-xs text-neutral-400 mb-1">Coverage cap</p>
                <p className="text-lg font-semibold text-neutral-900">${subscription.offer.coverage_cap.toLocaleString()}</p>
              </div>
              <div className="py-3 border-b border-neutral-100">
                <p className="text-xs text-neutral-400 mb-1">Property</p>
                <p className="text-sm font-medium text-neutral-900">
                  {subscription.offer.address}, {subscription.offer.city}, {subscription.offer.state}
                </p>
              </div>
              <div className="py-3 border-b border-neutral-100">
                <p className="text-xs text-neutral-400 mb-1">Flex Score</p>
                <p className="text-lg font-semibold text-neutral-900">{subscription.offer.flex_score}</p>
              </div>
              {subscription.current_period_end && (
                <div className="py-3 col-span-2">
                  <p className="text-xs text-neutral-400 mb-1">Next billing date</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-400 mb-4">You&apos;re on the waitlist. No active subscription yet.</p>
              <Link href="/offer" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors">
                Get your offer <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Claims */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-neutral-900" />
              <span className="text-sm font-semibold text-neutral-900">Claims</span>
            </div>
            {subscription?.status === 'active' && (
              <Link href="/dashboard/claims" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors flex items-center gap-1">
                File a claim <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {claims.length > 0 ? (
            <div className="space-y-3">
              {claims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 capitalize">
                      {claim.event_type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {new Date(claim.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                    claim.status === 'approved' || claim.status === 'paid' ? 'bg-emerald-50 text-emerald-700'
                    : claim.status === 'denied' ? 'bg-red-50 text-red-700'
                    : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {claim.status === 'under_review' ? 'Under review' : claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-5 h-5 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-400">No claims filed</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
