export const metadata = {
  title: 'Terms of Service — LeaseFlex',
};

export default function TermsPage() {
  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: February 2026</p>

        <div className="prose prose-neutral prose-sm max-w-none space-y-8 text-neutral-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">1. Overview</h2>
            <p>
              LeaseFlex (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) provides a lease flexibility protection
              product that covers certain financial penalties associated with early lease termination.
              By using our website and services, you agree to these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">2. Eligibility</h2>
            <p>
              You must be at least 18 years old and a current renter in the United States with an active
              residential lease to use LeaseFlex. You represent that all information provided during
              sign-up is accurate and complete.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">3. Coverage &amp; Pricing</h2>
            <p>
              LeaseFlex coverage is subject to a waiting period (60 or 180 days depending on your lease terms),
              a $1,500 deductible, and a coverage cap as stated in your offer. Pricing is based on your monthly
              rent, lease terms, and risk profile. Rates are locked for 48 hours from the time of your offer.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">4. Qualifying Events</h2>
            <p>Claims are covered for the following qualifying events:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Job relocation (50+ miles from current residence)</li>
              <li>Involuntary job loss</li>
              <li>Medical emergency requiring relocation</li>
              <li>Domestic safety concerns</li>
              <li>Military deployment or PCS orders</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">5. What&apos;s Not Covered</h2>
            <p>
              LeaseFlex does not cover moving costs, security deposit disputes, property damages,
              unpaid utilities, or voluntary relocation without a qualifying event.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">6. Cancellation</h2>
            <p>
              You may cancel your protection at any time after the 90-day minimum commitment period.
              Coverage ends at the end of your current billing cycle. No refunds are provided for
              partial months.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">7. Claims Process</h2>
            <p>
              To file a claim, submit documentation of your qualifying event through your account.
              Claims are reviewed within 5 business days. Approved claims are paid directly toward
              your lease termination costs, up to your coverage cap minus the deductible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">8. Limitation of Liability</h2>
            <p>
              LeaseFlex&apos;s total liability is limited to the coverage cap stated in your offer.
              We are not responsible for indirect, incidental, or consequential damages arising
              from the use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">9. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will be communicated
              via email. Continued use of LeaseFlex after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">10. Contact</h2>
            <p>
              Questions about these terms? Email us at{' '}
              <span className="text-neutral-900 font-medium">justin@leaseflex.io</span>.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
