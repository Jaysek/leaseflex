'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Upload, Loader2, Shield } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/parse-lease', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.parsed) {
        sessionStorage.setItem('leaseflex_parsed', JSON.stringify(data.parsed));
      }
    } catch {
      // If parsing fails, still navigate
    }

    setUploading(false);
    router.push('/offer');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 hero-grid opacity-[0.35]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 mt-8 mb-14 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-sand-dark/60 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs font-medium text-neutral-600">
            Going live Spring &apos;26
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.08]">
          Break your lease
          <br />
          <span className="bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 bg-clip-text text-transparent">
            without the penalty.
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-neutral-700 max-w-xl mx-auto leading-relaxed">
          Starting at <span className="font-semibold text-neutral-900">$9/month</span>. Price scales with your rent — get your exact quote in 60 seconds.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#how-it-works"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 transition-all"
          >
            Learn how it works
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="group inline-flex items-center gap-2 px-6 py-4 bg-white/70 backdrop-blur-sm text-neutral-700 text-sm font-medium rounded-full border border-sand-dark hover:border-neutral-300 hover:bg-white disabled:opacity-50 transition-all"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Reading lease...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                Upload my lease
              </>
            )}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        <p className="mt-5 text-sm text-neutral-600">
          Upload your lease in seconds and see if you qualify.
        </p>

        <p className="mt-3 text-sm text-neutral-500">
          No credit check &middot; Cancel anytime &middot; Not all leases qualify
        </p>
      </div>
    </section>
  );
}
