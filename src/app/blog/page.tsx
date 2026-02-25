import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Renter Guides — LeaseFlex Blog',
  description:
    'Practical guides for renters dealing with lease breaks, moving costs, rent increases, roommate problems, and more. Real answers to real renter problems.',
  alternates: { canonical: 'https://leaseflex.io/blog' },
};

const featured = {
  href: '/break-lease',
  title: 'Breaking a Lease — Everything You Need to Know',
  description:
    'The complete guide to breaking a lease. Costs, penalties, legal options, and how to protect yourself.',
  tag: 'Complete guide',
  articles: 7,
};

const articles = [
  {
    href: '/break-lease/cost-to-break-a-lease',
    title: 'How Much Does It Cost to Break a Lease?',
    description: 'Most renters face $2,000–$7,000+ in penalties. Here\'s exactly what to expect.',
    category: 'Breaking a Lease',
  },
  {
    href: '/break-lease/what-happens-if-you-break-a-lease',
    title: 'What Happens If You Break a Lease Early',
    description: 'From penalty fees to credit damage — the real consequences and what you can do.',
    category: 'Breaking a Lease',
  },
  {
    href: '/break-lease/moving-for-job-lease-not-over',
    title: 'Moving for a Job but Your Lease Isn\'t Over',
    description: 'How to handle a job relocation without getting crushed by lease-break fees.',
    category: 'Breaking a Lease',
  },
  {
    href: '/break-lease/roommate-moved-out',
    title: 'My Roommate Moved Out. What Do I Do?',
    description: 'When a roommate leaves mid-lease, here\'s how to protect yourself.',
    category: 'Breaking a Lease',
  },
  {
    href: '/break-lease/breakup-lease',
    title: 'We Broke Up but Our Lease Has 8 Months Left',
    description: 'How to navigate the awkward and expensive logistics of a breakup lease.',
    category: 'Breaking a Lease',
  },
  {
    href: '/break-lease/how-to-get-out-of-a-lease-legally',
    title: 'How to Get Out of a Lease Legally',
    description: 'Every legitimate legal option for exiting your lease without penalty.',
    category: 'Breaking a Lease',
  },
  {
    href: '/break-lease/lease-takeover',
    title: 'How to Find Someone to Take Over Your Lease',
    description: 'A lease takeover can save you thousands. Here\'s exactly how to do it.',
    category: 'Breaking a Lease',
  },
  {
    href: '/blog/cost-to-move-apartments',
    title: 'How Much Does It Cost to Move Apartments?',
    description: 'The full breakdown of moving costs — including the ones nobody talks about.',
    category: 'Moving',
  },
  {
    href: '/blog/can-landlord-raise-rent-mid-lease',
    title: 'Can a Landlord Raise Rent Mid-Lease?',
    description: 'Know your rights when your landlord tries to hike rent during your lease.',
    category: 'Rent',
  },
  {
    href: '/blog/what-happens-if-you-cant-afford-rent',
    title: 'What Happens If You Can\'t Afford Rent?',
    description: 'Your options when you\'re behind on rent — before it becomes an eviction.',
    category: 'Rent',
  },
];

export default function BlogIndex() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
        Renter Guides
      </h1>
      <p className="mt-4 text-lg text-neutral-500 max-w-2xl">
        Real answers to the problems renters actually face. No fluff, no legal jargon — just
        practical advice you can use today.
      </p>

      {/* Featured hub */}
      <Link
        href={featured.href}
        className="group mt-10 block p-8 bg-neutral-900 rounded-2xl hover:bg-neutral-800 transition-colors"
      >
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium text-neutral-400 bg-neutral-800 rounded-full mb-4">
          {featured.tag} · {featured.articles} articles
        </span>
        <h2 className="text-xl md:text-2xl font-semibold text-white group-hover:text-neutral-100">
          {featured.title}
        </h2>
        <p className="mt-2 text-neutral-400 text-sm leading-relaxed max-w-lg">
          {featured.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-neutral-400 group-hover:text-white transition-colors">
          Read the guide
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>

      {/* All articles */}
      <div className="mt-14">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">All articles</h2>
        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="group flex items-start justify-between gap-4 p-5 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all"
            >
              <div>
                <span className="text-xs text-neutral-400 font-medium">{article.category}</span>
                <h3 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors mt-0.5">
                  {article.title}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">{article.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-5" />
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 p-8 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
        <p className="text-sm text-neutral-500 mb-2">Life changes. Your lease should flex with you.</p>
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">
          LeaseFlex covers lease-break penalties — starting at $9/month.
        </h3>
        <Link
          href="/offer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
        >
          See if my lease qualifies
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
