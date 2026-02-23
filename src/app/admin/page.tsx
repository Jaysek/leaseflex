'use client';

import { useState } from 'react';
import { Shield, Loader2, Users, FileText, CreditCard, Mail } from 'lucide-react';

interface Offer {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  rent: number;
  address: string;
  city: string;
  state: string;
  monthly_price: number;
  coverage_cap: number;
  flex_score: number;
  status: string;
}

interface WaitlistEntry {
  id: string;
  created_at: string;
  email: string;
  name: string | null;
  phone: string | null;
  offer_id: string | null;
  monthly_price: number | null;
  flex_score: number | null;
  coverage_cap: number | null;
  city: string | null;
  state: string | null;
  drip_step: number;
}

interface Subscription {
  id: string;
  created_at: string;
  email: string;
  status: string;
  stripe_subscription_id: string;
  current_period_end: string;
}

interface Claim {
  id: string;
  created_at: string;
  email: string;
  event_type: string;
  event_description: string;
  status: string;
  payout_amount: number | null;
}

interface AdminData {
  offers: Offer[];
  waitlist: WaitlistEntry[];
  subscriptions: Subscription[];
  claims: Claim[];
  counts: { offers: number; waitlist: number; subscriptions: number; claims: number };
}

type Tab = 'overview' | 'offers' | 'waitlist' | 'subscriptions' | 'claims';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!secret) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin?secret=${encodeURIComponent(secret)}`);
      if (!res.ok) {
        setError('Invalid secret');
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setAuthenticated(true);
    } catch {
      setError('Failed to connect');
    }
    setLoading(false);
  }

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin?secret=${encodeURIComponent(secret)}`);
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
    setLoading(false);
  }

  if (!authenticated) {
    return (
      <section className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Admin</h1>
            <p className="text-sm text-neutral-400">Enter admin secret to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              placeholder="Admin secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              autoFocus
              className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!secret || loading}
              className="w-full py-3.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>
          {error && <p className="text-center mt-3 text-sm text-red-500">{error}</p>}
        </div>
      </section>
    );
  }

  if (!data) return null;

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'overview', label: 'Overview', icon: Shield },
    { key: 'offers', label: `Offers (${data.counts.offers})`, icon: FileText },
    { key: 'waitlist', label: `Waitlist (${data.counts.waitlist})`, icon: Mail },
    { key: 'subscriptions', label: `Subs (${data.counts.subscriptions})`, icon: CreditCard },
    { key: 'claims', label: `Claims (${data.counts.claims})`, icon: Users },
  ];

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Admin Dashboard</h1>
          <button
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Refresh'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.key
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Offers Generated', value: data.counts.offers, sub: 'total quotes' },
              { label: 'Waitlist Signups', value: data.counts.waitlist, sub: 'emails collected' },
              { label: 'Active Subscriptions', value: data.subscriptions.filter(s => s.status === 'active').length, sub: `of ${data.counts.subscriptions} total` },
              { label: 'Claims Filed', value: data.counts.claims, sub: `${data.claims.filter(c => c.status === 'submitted' || c.status === 'under_review').length} pending review` },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-neutral-100 p-6">
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900 tabular-nums">{stat.value}</p>
                <p className="text-xs text-neutral-400 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Offers */}
        {tab === 'offers' && (
          <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Location</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Rent</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Price</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Score</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.offers.map((o) => (
                    <tr key={o.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{formatDate(o.created_at)}</td>
                      <td className="px-4 py-3 font-medium text-neutral-900">{o.full_name || '—'}</td>
                      <td className="px-4 py-3 text-neutral-500">{o.email || '—'}</td>
                      <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{o.city}, {o.state}</td>
                      <td className="px-4 py-3 text-neutral-900 text-right tabular-nums">${o.rent?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-neutral-900 text-right tabular-nums">${o.monthly_price}/mo</td>
                      <td className="px-4 py-3 text-neutral-900 text-right tabular-nums">{o.flex_score}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          o.status === 'started_checkout' ? 'bg-emerald-50 text-emerald-700'
                          : o.status === 'emailed' ? 'bg-blue-50 text-blue-700'
                          : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {o.status || 'quoted'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Waitlist */}
        {tab === 'waitlist' && (
          <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Location</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Price</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Coverage</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Score</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Drip</th>
                  </tr>
                </thead>
                <tbody>
                  {data.waitlist.map((w) => (
                    <tr key={w.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{formatDate(w.created_at)}</td>
                      <td className="px-4 py-3 font-medium text-neutral-900">{w.name || '—'}</td>
                      <td className="px-4 py-3 text-neutral-500">{w.email}</td>
                      <td className="px-4 py-3 text-neutral-500">{w.phone || '—'}</td>
                      <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{w.city && w.state ? `${w.city}, ${w.state}` : '—'}</td>
                      <td className="px-4 py-3 text-neutral-900 text-right tabular-nums">{w.monthly_price ? `$${w.monthly_price}/mo` : '—'}</td>
                      <td className="px-4 py-3 text-neutral-900 text-right tabular-nums">{w.coverage_cap ? `$${w.coverage_cap.toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-3 text-neutral-900 text-right tabular-nums">{w.flex_score ?? '—'}</td>
                      <td className="px-4 py-3 text-neutral-500 text-right tabular-nums">{w.drip_step}/3</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subscriptions */}
        {tab === 'subscriptions' && (
          <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Stripe ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Renews</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subscriptions.map((s) => (
                    <tr key={s.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{formatDate(s.created_at)}</td>
                      <td className="px-4 py-3 text-neutral-900">{s.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          s.status === 'active' ? 'bg-emerald-50 text-emerald-700'
                          : s.status === 'past_due' ? 'bg-amber-50 text-amber-700'
                          : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-400 text-xs font-mono">{s.stripe_subscription_id || '—'}</td>
                      <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{s.current_period_end ? formatDate(s.current_period_end) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Claims */}
        {tab === 'claims' && (
          <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {data.claims.map((c) => (
                    <tr key={c.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{formatDate(c.created_at)}</td>
                      <td className="px-4 py-3 text-neutral-900">{c.email}</td>
                      <td className="px-4 py-3 text-neutral-500 capitalize whitespace-nowrap">{c.event_type.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-neutral-500 max-w-[200px] truncate">{c.event_description}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          c.status === 'approved' || c.status === 'paid' ? 'bg-emerald-50 text-emerald-700'
                          : c.status === 'denied' ? 'bg-red-50 text-red-700'
                          : c.status === 'under_review' ? 'bg-amber-50 text-amber-700'
                          : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {c.status === 'under_review' ? 'Under review' : c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-900 text-right tabular-nums">
                        {c.payout_amount ? `$${c.payout_amount.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
