'use client';

import { useState, useRef } from 'react';
import { Shield, Loader2, Users, FileText, CreditCard, Mail, Building2, Send, Upload, Plus, Eye, MousePointerClick, AlertTriangle } from 'lucide-react';

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

interface PartnerInquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  units: string | null;
  message: string | null;
}

interface OutreachProspect {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  city: string | null;
  state: string | null;
  units: string | null;
  source: string;
  status: string;
  last_contacted_at: string | null;
  notes: string | null;
}

interface AdminData {
  offers: Offer[];
  waitlist: WaitlistEntry[];
  subscriptions: Subscription[];
  claims: Claim[];
  partners: PartnerInquiry[];
  counts: { offers: number; waitlist: number; subscriptions: number; claims: number; partners: number };
}

type Tab = 'overview' | 'offers' | 'waitlist' | 'subscriptions' | 'claims' | 'partners' | 'outreach';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');

  // Outreach state
  const [prospects, setProspects] = useState<OutreachProspect[]>([]);
  const [emailStats, setEmailStats] = useState<Record<string, { sent: number; delivered: number; opened: number; clicked: number; bounced: number; last_step: string }>>({});
  const [totals, setTotals] = useState({ total_sent: 0, total_delivered: 0, total_opened: 0, total_clicked: 0, total_bounced: 0, total_complained: 0 });
  const [outreachLoaded, setOutreachLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');
  const [addForm, setAddForm] = useState({ name: '', email: '', company: '', city: '', state: '', units: '' });
  const [addingProspect, setAddingProspect] = useState(false);
  const csvRef = useRef<HTMLInputElement>(null);

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
    if (outreachLoaded) await loadProspects();
    setLoading(false);
  }

  async function loadProspects() {
    try {
      const res = await fetch(`/api/outreach/prospects?secret=${encodeURIComponent(secret)}`);
      if (res.ok) {
        const json = await res.json();
        setProspects(json.prospects || []);
        setEmailStats(json.emailStats || {});
        setTotals(json.totals || { total_sent: 0, total_delivered: 0, total_opened: 0, total_clicked: 0, total_bounced: 0, total_complained: 0 });
        setOutreachLoaded(true);
      }
    } catch { /* silent */ }
  }

  async function handleTabChange(t: Tab) {
    setTab(t);
    if (t === 'outreach' && !outreachLoaded) {
      await loadProspects();
    }
  }

  async function handleAddProspect(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.name || !addForm.email) return;
    setAddingProspect(true);

    try {
      const res = await fetch(`/api/outreach/prospects?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        setAddForm({ name: '', email: '', company: '', city: '', state: '', units: '' });
        await loadProspects();
      }
    } catch { /* silent */ }
    setAddingProspect(false);
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return;

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const nameIdx = headers.findIndex(h => h === 'name');
    const emailIdx = headers.findIndex(h => h === 'email');
    const companyIdx = headers.findIndex(h => h === 'company');
    const cityIdx = headers.findIndex(h => h === 'city');
    const stateIdx = headers.findIndex(h => h === 'state');
    const unitsIdx = headers.findIndex(h => h === 'units');

    if (nameIdx === -1 || emailIdx === -1) {
      setSendResult('CSV must have "name" and "email" columns');
      return;
    }

    const prospects = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      return {
        name: cols[nameIdx] || '',
        email: cols[emailIdx] || '',
        company: companyIdx >= 0 ? cols[companyIdx] : '',
        city: cityIdx >= 0 ? cols[cityIdx] : '',
        state: stateIdx >= 0 ? cols[stateIdx] : '',
        units: unitsIdx >= 0 ? cols[unitsIdx] : '',
        source: 'csv',
      };
    }).filter(p => p.name && p.email);

    if (prospects.length === 0) {
      setSendResult('No valid rows found in CSV');
      return;
    }

    try {
      const res = await fetch(`/api/outreach/prospects?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prospects),
      });
      const json = await res.json();
      setSendResult(`Imported ${json.added || 0} prospects from CSV`);
      await loadProspects();
    } catch {
      setSendResult('CSV import failed');
    }

    if (csvRef.current) csvRef.current.value = '';
  }

  async function handleSendToQueued() {
    setSending(true);
    setSendResult('');
    try {
      const res = await fetch(`/api/outreach/send?secret=${encodeURIComponent(secret)}`, { method: 'POST' });
      const json = await res.json();
      setSendResult(`Sent: ${json.sent}, Failed: ${json.failed || 0}`);
      await loadProspects();
    } catch {
      setSendResult('Send failed');
    }
    setSending(false);
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
    { key: 'partners', label: `Partners (${data.counts.partners})`, icon: Building2 },
    { key: 'outreach', label: `Outreach (${prospects.length})`, icon: Send },
  ];

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const outreachStats = {
    queued: prospects.filter(p => p.status === 'queued').length,
    sent: prospects.filter(p => p.status === 'sent').length,
    followed_up: prospects.filter(p => p.status === 'followed_up_1' || p.status === 'followed_up_2').length,
    replied: prospects.filter(p => p.status === 'replied').length,
    converted: prospects.filter(p => p.status === 'converted').length,
    unsubscribed: prospects.filter(p => p.status === 'unsubscribed').length,
  };

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      queued: 'bg-neutral-100 text-neutral-500',
      sent: 'bg-blue-50 text-blue-700',
      followed_up_1: 'bg-indigo-50 text-indigo-700',
      followed_up_2: 'bg-purple-50 text-purple-700',
      replied: 'bg-emerald-50 text-emerald-700',
      converted: 'bg-emerald-100 text-emerald-800',
      unsubscribed: 'bg-red-50 text-red-600',
      bounced: 'bg-amber-50 text-amber-700',
    };
    const labels: Record<string, string> = {
      queued: 'Queued',
      sent: 'Sent',
      followed_up_1: 'Follow-up 1',
      followed_up_2: 'Follow-up 2',
      replied: 'Replied',
      converted: 'Converted',
      unsubscribed: 'Unsub',
      bounced: 'Bounced',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[status] || 'bg-neutral-100 text-neutral-500'}`}>
        {labels[status] || status}
      </span>
    );
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
              onClick={() => handleTabChange(t.key)}
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

        {/* Partners */}
        {tab === 'partners' && (
          <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Units</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {data.partners.map((p) => (
                    <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{formatDate(p.created_at)}</td>
                      <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                      <td className="px-4 py-3 text-neutral-500">{p.email}</td>
                      <td className="px-4 py-3 text-neutral-500">{p.company || '—'}</td>
                      <td className="px-4 py-3 text-neutral-500">{p.units || '—'}</td>
                      <td className="px-4 py-3 text-neutral-500 max-w-[250px] truncate">{p.message || '—'}</td>
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

        {/* Outreach */}
        {tab === 'outreach' && (
          <div className="space-y-6">
            {/* Pipeline Stats */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: 'Queued', value: outreachStats.queued, color: 'text-neutral-900' },
                { label: 'Sent', value: outreachStats.sent, color: 'text-blue-600' },
                { label: 'Followed Up', value: outreachStats.followed_up, color: 'text-indigo-600' },
                { label: 'Replied', value: outreachStats.replied, color: 'text-emerald-600' },
                { label: 'Converted', value: outreachStats.converted, color: 'text-emerald-700' },
                { label: 'Unsub', value: outreachStats.unsubscribed, color: 'text-red-500' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-neutral-100 p-4 text-center">
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Email Delivery Stats */}
            {totals.total_sent > 0 && (
              <div className="bg-white rounded-xl border border-neutral-100 p-5">
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Email Tracking</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-neutral-900 tabular-nums">{totals.total_sent}</p>
                      <p className="text-[11px] text-neutral-400">Sent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-neutral-900 tabular-nums">{totals.total_delivered}</p>
                      <p className="text-[11px] text-neutral-400">Delivered {totals.total_sent > 0 && <span className="text-emerald-600">({Math.round(totals.total_delivered / totals.total_sent * 100)}%)</span>}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-neutral-900 tabular-nums">{totals.total_opened}</p>
                      <p className="text-[11px] text-neutral-400">Opened {totals.total_delivered > 0 && <span className="text-violet-600">({Math.round(totals.total_opened / totals.total_delivered * 100)}%)</span>}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                      <MousePointerClick className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-neutral-900 tabular-nums">{totals.total_clicked}</p>
                      <p className="text-[11px] text-neutral-400">Clicked {totals.total_opened > 0 && <span className="text-sky-600">({Math.round(totals.total_clicked / totals.total_opened * 100)}%)</span>}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-neutral-900 tabular-nums">{totals.total_bounced}</p>
                      <p className="text-[11px] text-neutral-400">Bounced{totals.total_complained > 0 && ` / ${totals.total_complained} spam`}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-neutral-900">Add Prospects</h3>
                <div className="flex gap-2">
                  <input
                    ref={csvRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => csvRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                  >
                    <Upload className="w-3 h-3" />
                    Import CSV
                  </button>
                  <button
                    onClick={handleSendToQueued}
                    disabled={sending || outreachStats.queued === 0}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    Send to {outreachStats.queued} queued
                  </button>
                </div>
              </div>

              {sendResult && (
                <p className="text-xs text-emerald-600 mb-4">{sendResult}</p>
              )}

              <form onSubmit={handleAddProspect} className="grid grid-cols-2 md:grid-cols-7 gap-2">
                <input
                  placeholder="Name *"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <input
                  placeholder="Email *"
                  type="email"
                  value={addForm.email}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <input
                  placeholder="Company"
                  value={addForm.company}
                  onChange={e => setAddForm(f => ({ ...f, company: e.target.value }))}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <input
                  placeholder="City"
                  value={addForm.city}
                  onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <input
                  placeholder="State"
                  value={addForm.state}
                  onChange={e => setAddForm(f => ({ ...f, state: e.target.value }))}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <input
                  placeholder="Units"
                  value={addForm.units}
                  onChange={e => setAddForm(f => ({ ...f, units: e.target.value }))}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!addForm.name || !addForm.email || addingProspect}
                  className="px-3 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  {addingProspect ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                  Add
                </button>
              </form>
            </div>

            {/* Prospect table */}
            <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Added</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Company</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Tracking</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Last Contact</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prospects.map((p) => (
                      <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{formatDate(p.created_at)}</td>
                        <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                        <td className="px-4 py-3 text-neutral-500">{p.email}</td>
                        <td className="px-4 py-3 text-neutral-500">{p.company || '—'}</td>
                        <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{p.city && p.state ? `${p.city}, ${p.state}` : p.city || p.state || '—'}</td>
                        <td className="px-4 py-3">{statusBadge(p.status)}</td>
                        <td className="px-4 py-3">
                          {emailStats[p.id] ? (
                            <div className="flex items-center gap-2">
                              {emailStats[p.id].delivered > 0 && (
                                <span className="flex items-center gap-0.5 text-[11px] text-emerald-600" title={`${emailStats[p.id].delivered} delivered`}>
                                  <Mail className="w-3 h-3" /> {emailStats[p.id].delivered}
                                </span>
                              )}
                              {emailStats[p.id].opened > 0 && (
                                <span className="flex items-center gap-0.5 text-[11px] text-violet-600" title={`${emailStats[p.id].opened} opened`}>
                                  <Eye className="w-3 h-3" /> {emailStats[p.id].opened}
                                </span>
                              )}
                              {emailStats[p.id].clicked > 0 && (
                                <span className="flex items-center gap-0.5 text-[11px] text-sky-600" title={`${emailStats[p.id].clicked} clicked`}>
                                  <MousePointerClick className="w-3 h-3" /> {emailStats[p.id].clicked}
                                </span>
                              )}
                              {emailStats[p.id].bounced > 0 && (
                                <span className="flex items-center gap-0.5 text-[11px] text-amber-600" title="Bounced">
                                  <AlertTriangle className="w-3 h-3" />
                                </span>
                              )}
                              {emailStats[p.id].delivered === 0 && emailStats[p.id].opened === 0 && emailStats[p.id].bounced === 0 && (
                                <span className="text-[11px] text-neutral-300">pending</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{p.last_contacted_at ? formatDate(p.last_contacted_at) : '—'}</td>
                        <td className="px-4 py-3 text-neutral-400 text-xs">{p.source}</td>
                      </tr>
                    ))}
                    {prospects.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-neutral-400 text-sm">
                          No prospects yet. Add one above or import a CSV.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
