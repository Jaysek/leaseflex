import OfferForm from '@/components/OfferForm';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Get Your Offer — LeaseFlex',
};

export default function OfferPage() {
  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-lg mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-neutral-100 mb-4">
            <Shield className="w-6 h-6 text-neutral-700" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            Tell us about your lease
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            We&apos;ll generate a personalized flexibility offer in seconds.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-8">
          <OfferForm />
        </div>

        <p className="mt-6 text-xs text-neutral-400 text-center">
          Your information is encrypted and never shared with your landlord.
        </p>
      </div>
    </section>
  );
}
