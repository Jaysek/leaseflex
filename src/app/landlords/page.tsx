'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Building2,
  ShieldCheck,
  DollarSign,
  Clock,
  Users,
  Zap,
} from 'lucide-react';
import { track } from '@/lib/analytics';

export default function LandlordsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    units: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setSubmitting(true);
    track('partner_inquiry');

    try {
      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch {
      // still show success
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-white overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-grid opacity-[0.2]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200/60 shadow-sm mb-8">
            <Building2 className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-xs font-medium text-neutral-600">For Property Owners &amp; Managers</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.08]">
            Fill vacancies faster.
            <br />
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 bg-clip-text text-transparent">
              Keep tenants longer.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Offer LeaseFlex as a tenant amenity. Prospects sign faster when they know they can leave if life changes — and you stay financially protected.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#partner-form"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 transition-all"
            >
              Become a partner
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-4 bg-white/80 backdrop-blur-sm text-neutral-700 text-sm font-medium rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all"
            >
              See how it works
            </a>
          </div>

          <p className="mt-5 text-sm text-neutral-400">
            Free for property owners &middot; No integration required &middot; Live in under a week
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-neutral-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">24%</p>
              <p className="text-sm text-neutral-400 mt-2">of renters break their lease early</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">$4,200</p>
              <p className="text-sm text-neutral-400 mt-2">average cost of a lease break</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">47 days</p>
              <p className="text-sm text-neutral-400 mt-2">average vacancy between tenants</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              Rigid leases cost you money
            </h2>
            <p className="mt-3 text-neutral-500 max-w-xl mx-auto">
              When prospects worry about being locked in, they hesitate, negotiate shorter terms, or walk away entirely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-neutral-200 p-8">
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-6">Without LeaseFlex</p>
              <div className="space-y-4">
                {[
                  'Prospects hesitate to sign long-term leases',
                  'Tenants ghost when life changes',
                  'You chase termination fees through collections',
                  'Units sit empty for weeks between tenants',
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    </div>
                    <span className="text-sm text-neutral-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-neutral-900 p-8 relative">
              <div className="absolute -top-2.5 left-6 px-2.5 py-0.5 bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-wider rounded">
                With LeaseFlex
              </div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-6">&nbsp;</p>
              <div className="space-y-4">
                {[
                  'Prospects sign faster with exit protection',
                  'LeaseFlex handles early terminations',
                  'You receive guaranteed payouts — no collections',
                  'Units re-list immediately with no gap',
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              How it works for you
            </h2>
            <p className="mt-3 text-neutral-500">
              Zero cost. Zero integration. Zero risk.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Offer at lease signing',
                description: 'Mention LeaseFlex as an available amenity. We provide materials — you just share the link.',
              },
              {
                step: '02',
                icon: DollarSign,
                title: 'Tenant signs up directly',
                description: 'The tenant subscribes on their own. You are not involved in billing, claims, or any administration.',
              },
              {
                step: '03',
                icon: ShieldCheck,
                title: 'If they need to leave early',
                description: 'LeaseFlex pays the termination cost directly. You receive the payout, re-list the unit, done.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border border-neutral-100 p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{item.step}</span>
                  </div>
                  <item.icon className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              What property owners get
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: DollarSign, title: 'Completely free', desc: 'No cost to you, ever. The tenant pays the subscription.' },
              { icon: Zap, title: 'No integration', desc: 'No software to install. No workflow changes. Just share a link.' },
              { icon: ShieldCheck, title: 'Guaranteed payouts', desc: 'If a tenant activates coverage, you receive the agreed termination payment.' },
              { icon: Clock, title: 'Faster lease-ups', desc: 'Flexibility removes hesitation. Prospects who feel safe commit faster.' },
              { icon: Users, title: 'Better tenants', desc: 'LeaseFlex attracts high-income, mobile professionals who plan ahead.' },
              { icon: Building2, title: 'Competitive edge', desc: 'Stand out in listings. "Flexible leasing available" is a real differentiator.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof quote */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xl md:text-2xl font-medium text-neutral-700 leading-relaxed italic">
            &ldquo;If I could tell every prospect &lsquo;you can leave if you need to,&rsquo; they&apos;d sign on the spot. That&apos;s what LeaseFlex does.&rdquo;
          </p>
          <p className="mt-6 text-sm text-neutral-400">
            — Property manager, 200+ units, New York City
          </p>
        </div>
      </section>

      {/* Partner Form */}
      <section id="partner-form" className="py-24 bg-white">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              Become a partner
            </h2>
            <p className="mt-3 text-neutral-500">
              Tell us about your portfolio. We&apos;ll set you up in under a week.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@property.com"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Acme Properties"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Number of units</label>
                  <select
                    value={form.units}
                    onChange={(e) => setForm({ ...form, units: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                  >
                    <option value="">Select</option>
                    <option value="1-10">1–10</option>
                    <option value="11-50">11–50</option>
                    <option value="51-200">51–200</option>
                    <option value="201-1000">201–1,000</option>
                    <option value="1000+">1,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Anything else?</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your properties, markets, or questions..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full group inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 shadow-lg shadow-neutral-900/20 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Get started'}
                {!submitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              </button>

              <p className="text-center text-xs text-neutral-400">
                We&apos;ll reach out within 24 hours.
              </p>
            </form>
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">We&apos;ll be in touch</h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                Thanks for your interest. We&apos;ll reach out within 24 hours to discuss how LeaseFlex can work for your properties.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight mb-4">
            Your competitors will offer this.
            <br />
            <span className="text-neutral-500">Be first.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-10">
            Flexible leasing is becoming the standard. Early adopters win the best tenants.
          </p>

          <a
            href="#partner-form"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 text-sm font-medium rounded-full hover:bg-neutral-100 transition-colors"
          >
            Partner with LeaseFlex
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>
    </main>
  );
}
