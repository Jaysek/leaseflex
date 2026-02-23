import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Users,
  Clock,
  Globe,
  CheckCircle2,
  Laptop,
  Briefcase,
  Heart,
  MapPin,
  Rocket,
  Tv,
  Plane,
  Car,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Property Owners — LeaseFlex',
  description:
    'Increase lease conversions with flexible leasing. LeaseFlex gives renters the confidence to sign — while protecting landlords from early termination risk.',
};

export default function LandlordsPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-50 border border-neutral-100 mb-8">
            <Building2 className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-xs font-medium text-neutral-500">For Property Owners</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.08]">
            Increase lease conversions
            <br />
            <span className="text-neutral-400">with flexible leasing</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            LeaseFlex gives renters the confidence to sign long-term leases&mdash;while protecting landlords from early termination risk.
          </p>

          <p className="mt-4 text-base font-medium text-neutral-700">
            When renters feel safe committing, properties lease faster.
          </p>

          <div className="mt-10">
            <Link
              href="#partner"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 shadow-lg shadow-neutral-900/20 transition-all"
            >
              Partner with LeaseFlex
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Core Problem */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
              The core problem
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-6">
              Renters hesitate before signing long leases
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed mb-10">
              Modern renters live in a world where everything is flexible.
            </p>
          </div>

          {/* Flexibility comparison */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Tv, label: 'Streaming', detail: 'Cancel anytime' },
              { icon: Plane, label: 'Travel', detail: 'Flexible bookings' },
              { icon: Car, label: 'Transportation', detail: 'Subscriptions' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 px-5 py-4 bg-white rounded-xl border border-neutral-100"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-neutral-500" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-sm font-medium text-neutral-700 block">{item.label}</span>
                  <span className="text-xs text-neutral-400">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-neutral-600 leading-relaxed mb-8 max-w-3xl">
            But housing still requires rigid commitments. Because life changes, renters hesitate before signing leases. They worry about:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
            {[
              { icon: Briefcase, label: 'Job relocation' },
              { icon: Rocket, label: 'Career changes' },
              { icon: Heart, label: 'Relationship changes' },
              { icon: Building2, label: 'Buying a home' },
              { icon: MapPin, label: 'Moving cities' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-neutral-100"
              >
                <item.icon className="w-4 h-4 text-neutral-400 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-neutral-600">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-8 max-w-3xl">
            <p className="text-neutral-700 font-medium">
              This hesitation slows leasing velocity and increases vacancy risk.
            </p>
          </div>
        </div>
      </section>

      {/* The Core Insight */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
                The core insight
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-6">
                Flexibility increases lease conversion
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-4">
                When renters feel trapped, they delay signing.
              </p>
              <p className="text-neutral-500 leading-relaxed mb-6">
                When renters feel protected, they commit.
              </p>
              <p className="text-neutral-700 font-medium leading-relaxed">
                LeaseFlex removes the fear of being locked into a lease.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
                Properties that offer flexible leasing:
              </p>
              <div className="space-y-3">
                {[
                  'Convert prospects faster',
                  'Attract higher-quality renters',
                  'Reduce vacancy risk',
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-4 px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-neutral-700">{text}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm font-medium text-neutral-900">
                Flexibility turns interest into signed leases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Scenario */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
              Example scenario
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
              A renter is choosing between two identical apartments.
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-8">
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl border border-neutral-200 p-6">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                  Apartment A
                </p>
                <p className="text-lg font-semibold text-neutral-900 mb-1">Standard lease</p>
                <p className="text-sm text-neutral-400">No flexibility</p>
              </div>
              <div className="rounded-xl border-2 border-neutral-900 p-6 relative">
                <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-wider rounded">
                  Most chosen
                </div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                  Apartment B
                </p>
                <p className="text-lg font-semibold text-neutral-900 mb-1">Standard lease + LeaseFlex</p>
                <p className="text-sm text-neutral-500">Exit protection included</p>
              </div>
            </div>

            <p className="text-neutral-700 font-medium">
              Most renters choose the apartment that offers flexibility. LeaseFlex helps properties convert interest into signed leases.
            </p>
          </div>
        </div>
      </section>

      {/* How LeaseFlex Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              How LeaseFlex works
            </h2>
            <p className="mt-3 text-neutral-500 max-w-lg mx-auto">
              LeaseFlex sits between the renter and the lease obligation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                step: '01',
                title: 'Tenant signs their lease',
                description: 'Your leasing process remains exactly the same.',
              },
              {
                step: '02',
                title: 'Tenant adds LeaseFlex',
                description: 'Offered as an optional protection add-on.',
              },
              {
                step: '03',
                title: 'Tenant pays a small monthly fee',
                description: 'Typically $15–$30 per month. Rent collection continues normally.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-neutral-50 rounded-2xl border border-neutral-100 p-6"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center mb-4">
                  <span className="text-xs font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* If tenant needs to exit early */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">
              If a tenant needs to exit early
            </h3>
            <p className="text-neutral-500 mb-6">LeaseFlex handles the financial obligation.</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                'Lease break penalties covered',
                'Early termination fees paid',
                'Remaining rent obligations capped',
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-600">{text}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-neutral-900">
              The landlord receives the agreed termination payment. The unit can immediately be re-listed.
            </p>
          </div>
        </div>
      </section>

      {/* Landlords Take No Financial Risk */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-neutral-100 mb-6">
            <ShieldCheck className="w-8 h-8 text-neutral-900" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
            Landlords take no financial risk
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-12">
            LeaseFlex protects property revenue. If a tenant activates coverage:
          </p>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              {
                title: 'Termination cost covered',
                description: 'LeaseFlex pays the termination cost.',
              },
              {
                title: 'Agreed payout received',
                description: 'The landlord receives the agreed payout.',
              },
              {
                title: 'Unit re-listed immediately',
                description: 'The unit is re-listed immediately to minimize downtime.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm font-medium text-neutral-700">
            Your property remains financially protected.
          </p>
        </div>
      </section>

      {/* Why Modern Properties Offer LeaseFlex */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
                Attract premium tenants
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-6">
                Why modern properties offer LeaseFlex
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-4">
                Flexible leasing is becoming a competitive advantage. Properties offering flexibility attract renters who value mobility.
              </p>
              <p className="text-neutral-500 leading-relaxed">
                These renters are highly mobile&mdash;and highly valuable tenants.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
                Typical LeaseFlex renters include:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Tech workers',
                  'Consultants',
                  'Entrepreneurs',
                  'Remote professionals',
                  'High-income renters',
                  'Young professionals',
                ].map((label) => (
                  <div
                    key={label}
                    className="px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-100 text-sm font-medium text-neutral-700 text-center"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Property Integration */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-neutral-100 mb-4">
              <Laptop className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-3">
              Seamless property integration
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto">
              LeaseFlex integrates easily into your leasing process.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: 'Offer during lease signing', description: 'Optional tenant add-on at signing.' },
              { icon: Users, title: 'Optional tenant add-on', description: 'Let tenants choose to add protection.' },
              { icon: Globe, title: 'Integrate through leasing platforms', description: 'Works with existing property management tools.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-neutral-100 p-6 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 mb-3">
                  <item.icon className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">{item.title}</h3>
                <p className="text-sm text-neutral-500">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-6 text-sm text-neutral-400">
            No operational changes required.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">24%</p>
              <p className="text-sm text-neutral-500 mt-2">of renters break their lease early</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">$4,200</p>
              <p className="text-sm text-neutral-500 mt-2">average cost of a lease break</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">2.3x</p>
              <p className="text-sm text-neutral-500 mt-2">faster lease conversion with flexibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="partner" className="py-24 md:py-32 bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight mb-4">
            Increase lease conversions with LeaseFlex
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-2">
            Give renters the confidence to commit.
          </p>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-10">
            While keeping your property financially protected.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:justin@leaseflex.io?subject=LeaseFlex%20Partnership%20Inquiry"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 text-sm font-medium rounded-full hover:bg-neutral-100 transition-colors"
            >
              Partner with LeaseFlex
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="mailto:justin@leaseflex.io?subject=Schedule%20a%20Call%20-%20LeaseFlex"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white text-sm font-medium rounded-full border border-neutral-700 hover:border-neutral-500 transition-colors"
            >
              Schedule a call
            </a>
          </div>

          <p className="mt-8 text-sm text-neutral-500">
            No integration required &middot; Free for property owners &middot; Launch in under a week
          </p>
        </div>
      </section>
    </main>
  );
}
