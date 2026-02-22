export const metadata = {
  title: 'Privacy Policy — LeaseFlex',
};

export default function PrivacyPage() {
  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: February 2026</p>

        <div className="prose prose-neutral prose-sm max-w-none space-y-8 text-neutral-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">1. Information We Collect</h2>
            <p>When you use LeaseFlex, we collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Lease information:</strong> Monthly rent, address, city, state, lease dates, termination terms, and subletting permissions.</li>
              <li><strong>Contact information:</strong> Email address (when you request an offer email or join the waitlist).</li>
              <li><strong>Uploaded documents:</strong> Lease PDFs you upload are processed to extract lease terms and are not permanently stored.</li>
              <li><strong>Payment information:</strong> Processed securely through Stripe. We do not store credit card numbers.</li>
              <li><strong>Usage data:</strong> Anonymous analytics about how you interact with our site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Generate personalized flexibility offers based on your lease terms</li>
              <li>Process payments and manage your protection plan</li>
              <li>Send you offer details and account notifications via email</li>
              <li>Improve our pricing models and product experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">3. What We Don&apos;t Do</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>We <strong>never</strong> share your information with your landlord</li>
              <li>We <strong>never</strong> sell your personal data to third parties</li>
              <li>We <strong>never</strong> run credit checks</li>
              <li>We <strong>never</strong> store uploaded lease documents after processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">4. Data Storage &amp; Security</h2>
            <p>
              Your data is stored on secure, encrypted servers. We use industry-standard
              security practices including HTTPS encryption, secure database access controls,
              and regular security audits. Payment processing is handled entirely by Stripe,
              a PCI-DSS Level 1 certified provider.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Stripe</strong> — Payment processing</li>
              <li><strong>Supabase</strong> — Secure data storage</li>
              <li><strong>Resend</strong> — Transactional email delivery</li>
              <li><strong>Vercel</strong> — Application hosting</li>
            </ul>
            <p className="mt-2">
              Each provider has their own privacy policy and operates under strict data
              protection standards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Request a copy of your personal data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Correct any inaccurate information in your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">7. Cookies</h2>
            <p>
              We use essential cookies to maintain your session state. We do not use
              advertising cookies or tracking pixels. Analytics data is collected anonymously.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you
              of material changes via email or a prominent notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">9. Contact</h2>
            <p>
              Privacy questions or data requests? Email us at{' '}
              <span className="text-neutral-900 font-medium">justin@leaseflex.io</span>.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
