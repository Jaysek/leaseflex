'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Upload, Loader2, Star } from 'lucide-react';

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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        {/* Social proof chip */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200/60 shadow-sm">
          <div className="flex -space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-xs font-medium text-neutral-600">
            Trusted by 2,400+ renters
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.08]">
          Your lease shouldn&apos;t
          <br />
          <span className="bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 bg-clip-text text-transparent">
            trap you.
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Break your lease without the financial hit. AI-powered
          protection starting at $12/mo.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/offer"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 transition-all"
          >
            Get my offer — free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="group inline-flex items-center gap-2 px-6 py-4 bg-white/80 backdrop-blur-sm text-neutral-700 text-sm font-medium rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-white disabled:opacity-50 transition-all"
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

        <p className="mt-6 text-xs text-neutral-400">
          No credit check &middot; Cancel anytime &middot; 2-minute setup
        </p>

        {/* Press / Backed by bar */}
        <div className="mt-16 pt-10 border-t border-neutral-200/50">
          <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-5">
            Built for renters in
          </p>
          <div className="flex items-center justify-center gap-8 sm:gap-12 text-neutral-300 text-sm font-semibold tracking-wide">
            <span>New York</span>
            <span className="hidden sm:inline">San Francisco</span>
            <span>Austin</span>
            <span>Chicago</span>
            <span className="hidden sm:inline">Miami</span>
          </div>
        </div>
      </div>
    </section>
  );
}
