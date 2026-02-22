import Hero from '@/components/Hero';
import LeaseCostCalculator from '@/components/LeaseCostCalculator';
import WhenItPaysForItself from '@/components/WhenItPaysForItself';
import HowItWorks from '@/components/HowItWorks';
import CoverageTable from '@/components/CoverageTable';
import PricingPreview from '@/components/PricingPreview';
import TrustSignals from '@/components/TrustSignals';
import FAQ from '@/components/FAQ';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="animate-section" style={{ animationDelay: '0.1s' }}>
        <LeaseCostCalculator />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.12s' }}>
        <WhenItPaysForItself />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.14s' }}>
        <HowItWorks />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.16s' }}>
        <CoverageTable />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.18s' }}>
        <PricingPreview />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.2s' }}>
        <TrustSignals />
      </div>
      <div className="animate-section" style={{ animationDelay: '0.22s' }}>
        <FAQ />
      </div>

      {/* Final CTA */}
      <section className="relative py-32 bg-neutral-900 overflow-hidden animate-section" style={{ animationDelay: '0.24s' }}>
        <div className="absolute inset-0 hero-grid opacity-[0.08]" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <p className="text-lg text-neutral-400 mb-6">
            One life change can cost $10,000.
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            LeaseFlex costs $20.
          </h2>
          <p className="mt-6 text-neutral-500">
            Get your personalized offer in under 2 minutes.
          </p>
          <Link
            href="/offer"
            className="mt-10 group inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 text-sm font-semibold rounded-full hover:bg-neutral-100 transition-colors shadow-lg shadow-white/10"
          >
            See if my lease qualifies
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
