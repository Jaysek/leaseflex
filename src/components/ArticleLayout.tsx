import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href: string;
}

interface ArticleLayoutProps {
  title: string;
  description: string;
  publishedAt: string;
  breadcrumbs: Breadcrumb[];
  children: React.ReactNode;
}

export default function ArticleLayout({
  title,
  description,
  publishedAt,
  breadcrumbs,
  children,
}: ArticleLayoutProps) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
        <Link href="/" className="hover:text-neutral-600 transition-colors">
          Home
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <span>/</span>
            <Link href={crumb.href} className="hover:text-neutral-600 transition-colors">
              {crumb.label}
            </Link>
          </span>
        ))}
      </nav>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
        {title}
      </h1>
      <p className="mt-4 text-lg text-neutral-500 leading-relaxed">{description}</p>
      <time className="block mt-4 text-sm text-neutral-400">{publishedAt}</time>

      <hr className="my-8 border-neutral-100" />

      {/* Article body */}
      <div className="article-body">{children}</div>

      {/* Soft CTA */}
      <div className="mt-16 p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
        <p className="text-sm text-neutral-500 mb-2">Protect yourself before life changes</p>
        <h3 className="text-xl font-semibold text-neutral-900 mb-1">
          LeaseFlex covers lease-break penalties — starting at $9/month.
        </h3>
        <p className="text-sm text-neutral-400 mb-4">
          Get a personalized offer in under 2 minutes. No commitment required.
        </p>
        <Link
          href="/offer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
        >
          See if my lease qualifies
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
