import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import HowItWorks from '@/components/HowItWorks';
import CoverageTable from '@/components/CoverageTable';
import PricingPreview from '@/components/PricingPreview';
import FAQ from '@/components/FAQ';
import TrustSignals from '@/components/TrustSignals';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="animate-section" style={{ animationDelay: '0.1s' }}>
        <SocialProof />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.15s' }}>
        <HowItWorks />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.2s' }}>
        <CoverageTable />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.25s' }}>
        <PricingPreview />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.3s' }}>
        <FAQ />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.35s' }}>
        <TrustSignals />
      </div>

      {/* Bottom CTA */}
      <section className="relative py-32 bg-neutral-900 overflow-hidden animate-section" style={{ animationDelay: '0.4s' }}>
        <div className="absolute inset-0 hero-grid opacity-[0.08]" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
            Stop waiting
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            Your lease shouldn&apos;t<br />control your life.
          </h2>
          <p className="mt-5 text-neutral-400 text-lg">
            Get your personalized offer in under 2 minutes. No credit check. No commitment.
          </p>
          <Link
            href="/offer"
            className="mt-10 group inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 text-sm font-semibold rounded-full hover:bg-neutral-100 transition-colors shadow-lg shadow-white/10"
          >
            Get my offer — free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="mt-6 text-xs text-neutral-600">
            2,400+ renters already protected &middot; 98% claims approved
          </p>
        </div>
      </section>
    </>
  );
}
