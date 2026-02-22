import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function ConfidenceSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 mb-6">
          <ShieldCheck className="w-8 h-8 text-neutral-900" strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-6">
          Sign your lease with confidence.
        </h2>

        <p className="text-lg text-neutral-500 leading-relaxed mb-4">
          Many renters hesitate to commit to a 12-month lease.
        </p>

        <p className="text-lg text-neutral-500 leading-relaxed mb-4">
          Why? Because life can change overnight.
        </p>

        <p className="text-lg text-neutral-700 font-medium leading-relaxed mb-4">
          LeaseFlex removes that risk.
        </p>

        <p className="text-lg text-neutral-900 font-semibold leading-relaxed mb-10">
          Sign your lease today knowing you have an exit.
        </p>

        <Link
          href="/offer"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 shadow-lg shadow-neutral-900/20 transition-all"
        >
          Get my offer — free
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
