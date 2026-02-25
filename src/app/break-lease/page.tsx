import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Breaking a Lease — Everything You Need to Know | LeaseFlex',
  description:
    'The complete guide to breaking a lease. Learn about costs, penalties, legal options, and how to protect yourself. Trusted by thousands of renters.',
  alternates: { canonical: 'https://leaseflex.io/break-lease' },
  openGraph: {
    title: 'Breaking a Lease — Everything You Need to Know',
    description:
      'The complete guide to breaking a lease. Learn about costs, penalties, legal options, and how to protect yourself.',
    url: 'https://leaseflex.io/break-lease',
  },
};

const articles = [
  {
    href: '/break-lease/cost-to-break-a-lease',
    title: 'How Much Does It Cost to Break a Lease?',
    description:
      'Most renters face $2,000–$7,000+ in penalties. Here\'s exactly what landlords charge and how to reduce the damage.',
    tag: 'Costs',
  },
  {
    href: '/break-lease/what-happens-if-you-break-a-lease',
    title: 'What Happens If You Break a Lease Early',
    description:
      'From penalty fees to credit damage — the real consequences of breaking a lease, and what you can do about each one.',
    tag: 'Consequences',
  },
  {
    href: '/break-lease/moving-for-job-lease-not-over',
    title: 'Moving for a Job but Your Lease Isn\'t Over',
    description:
      'You got the offer. But your lease has 8 months left. Here\'s how to handle a job relocation without getting crushed by fees.',
    tag: 'Job relocation',
  },
  {
    href: '/break-lease/roommate-moved-out',
    title: 'My Roommate Moved Out. What Do I Do?',
    description:
      'When a roommate leaves mid-lease, you\'re usually still on the hook for full rent. Here\'s how to protect yourself.',
    tag: 'Roommates',
  },
  {
    href: '/break-lease/breakup-lease',
    title: 'We Broke Up but Our Lease Has 8 Months Left',
    description:
      'Breaking up is hard. Breaking a lease on top of it is expensive. Here\'s how to navigate the awkward logistics.',
    tag: 'Life changes',
  },
  {
    href: '/break-lease/how-to-get-out-of-a-lease-legally',
    title: 'How to Get Out of a Lease Legally',
    description:
      'There are legitimate legal reasons to exit a lease without penalty. Here\'s every option available to you.',
    tag: 'Legal',
  },
  {
    href: '/break-lease/lease-takeover',
    title: 'How to Find Someone to Take Over Your Lease',
    description:
      'A lease takeover can save you thousands. Here\'s exactly how to find a replacement tenant and get your landlord to agree.',
    tag: 'Subletting',
  },
];

const relatedArticles = [
  {
    href: '/blog/cost-to-move-apartments',
    title: 'How Much Does It Cost to Move Apartments?',
  },
  {
    href: '/blog/can-landlord-raise-rent-mid-lease',
    title: 'Can a Landlord Raise Rent Mid-Lease?',
  },
  {
    href: '/blog/what-happens-if-you-cant-afford-rent',
    title: 'What Happens If You Can\'t Afford Rent?',
  },
];

export default function BreakLeaseHub() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
        <Link href="/" className="hover:text-neutral-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-neutral-600">Breaking a Lease</span>
      </nav>

      {/* Hero */}
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
        Breaking a Lease
      </h1>
      <p className="mt-4 text-lg md:text-xl text-neutral-500 leading-relaxed max-w-2xl">
        Life changes. Leases don&apos;t. Whether it&apos;s a new job, a breakup, or a roommate
        bailing — here&apos;s everything you need to know about getting out of your lease.
      </p>

      {/* Stats bar */}
      <div className="mt-10 grid grid-cols-3 gap-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
        <div>
          <p className="text-2xl font-bold text-neutral-900">$4,200</p>
          <p className="text-sm text-neutral-500">Average lease-break cost</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-900">44%</p>
          <p className="text-sm text-neutral-500">of renters break a lease at some point</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-900">2–3 mo</p>
          <p className="text-sm text-neutral-500">rent in typical penalties</p>
        </div>
      </div>

      {/* Article grid */}
      <div className="mt-14 space-y-6">
        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="group block p-6 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium text-neutral-500 bg-neutral-100 rounded-full mb-3">
                  {article.tag}
                </span>
                <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                  {article.title}
                </h2>
                <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">
                  {article.description}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-8" />
            </div>
          </Link>
        ))}
      </div>

      {/* Related articles */}
      <div className="mt-16 pt-10 border-t border-neutral-100">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Related guides</h3>
        <div className="space-y-3">
          {relatedArticles.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              {a.title}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 p-8 bg-neutral-900 rounded-2xl text-center">
        <p className="text-neutral-400 text-sm mb-2">Don&apos;t wait until you need to break your lease</p>
        <h3 className="text-xl font-semibold text-white mb-4">
          LeaseFlex covers lease-break penalties — starting at $9/month.
        </h3>
        <Link
          href="/offer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 text-sm font-semibold rounded-full hover:bg-neutral-100 transition-colors"
        >
          See if my lease qualifies
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
