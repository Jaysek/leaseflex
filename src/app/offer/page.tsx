import OfferForm from '@/components/OfferForm';
import { Lock } from 'lucide-react';

export const metadata = {
  title: 'Get Your Offer — LeaseFlex',
};

export default function OfferPage() {
  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-lg mx-auto px-6 py-16">
        {/* Progress hint */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-1 rounded-full bg-neutral-900" />
            <div className="w-8 h-1 rounded-full bg-neutral-200" />
            <div className="w-8 h-1 rounded-full bg-neutral-200" />
          </div>
          <span className="text-[11px] text-neutral-400 ml-2">Step 1 of 3</span>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            Get your personalized offer
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Takes under 2 minutes. No credit check required.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-8">
          <OfferForm />
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6">
          <Lock className="w-3 h-3 text-neutral-300" />
          <p className="text-xs text-neutral-400">
            Encrypted and never shared with your landlord.
          </p>
        </div>
      </div>
    </section>
  );
}
