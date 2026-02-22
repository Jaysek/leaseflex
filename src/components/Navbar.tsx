import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />
          <span className="text-base font-semibold tracking-tight text-neutral-900">
            LeaseFlex
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          <Link
            href="/#how-it-works"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#coverage"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Coverage
          </Link>
          <Link
            href="/landlords"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            For Landlords
          </Link>
        </div>

        <Link
          href="/offer"
          className="px-5 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
        >
          Get your offer
        </Link>
      </div>
    </nav>
  );
}
