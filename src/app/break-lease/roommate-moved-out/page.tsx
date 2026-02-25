import { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'My Roommate Moved Out — Am I Stuck With the Full Rent? | LeaseFlex',
  description:
    "When a roommate leaves mid-lease, you're usually on the hook for full rent. Here's what to do, your legal options, and how to protect yourself.",
  alternates: {
    canonical: 'https://leaseflex.io/break-lease/roommate-moved-out',
  },
};

export default function RoommateMovedOut() {
  return (
    <ArticleLayout
      title="My Roommate Moved Out. What Do I Do?"
      description="When a roommate leaves mid-lease, you're usually still on the hook for the full rent. Here's how to protect yourself and your options going forward."
      publishedAt="February 24, 2026"
      breadcrumbs={[{ label: 'Breaking a Lease', href: '/break-lease' }]}
    >
      <p>
        Your roommate just told you they&apos;re moving out. Maybe they got a new job, maybe
        they&apos;re moving in with a partner, or maybe they just ghosted. Either way, you&apos;re
        now staring at an apartment you can&apos;t afford alone — and a lease with both your
        names on it.
      </p>
      <p>
        This is one of the most common renter nightmares. Here&apos;s exactly what&apos;s
        happening legally, what your options are, and how to get through it.
      </p>

      <h2>Are You Responsible for the Full Rent?</h2>
      <p>
        <strong>Probably yes.</strong> If both you and your roommate signed the same lease,
        you almost certainly have <strong>joint and several liability</strong>. This is the
        standard language in most residential leases, and it means:
      </p>
      <ul>
        <li>Each tenant is individually responsible for the <strong>full</strong> rent amount</li>
        <li>The landlord can collect 100% of the rent from either tenant</li>
        <li>It doesn&apos;t matter what private arrangement you and your roommate had</li>
        <li>If your roommate stops paying, the landlord comes after you — not them</li>
      </ul>
      <p>
        From the landlord&apos;s perspective, they signed a lease for $2,400/month. They
        don&apos;t care who pays it. If your roommate leaves and you only pay $1,200, you&apos;re
        in breach of the lease — even though your roommate is the one who bailed.
      </p>

      <h3>What If You Have Separate Leases?</h3>
      <p>
        If you and your roommate each signed individual leases (sometimes called
        &quot;by-the-bed&quot; leases, common in student housing), you are only responsible
        for your own portion. Your roommate&apos;s departure is the landlord&apos;s problem,
        not yours. But this arrangement is rare outside of student housing.
      </p>

      <h2>What to Do Immediately</h2>

      <h3>1. Talk to Your Landlord</h3>
      <p>
        Don&apos;t wait. Contact your landlord as soon as you know your roommate is leaving.
        Explain the situation and ask about your options. Most landlords would rather work
        with you than start an eviction process. Possible outcomes:
      </p>
      <ul>
        <li>They allow you to find a replacement roommate</li>
        <li>They let you move to a smaller, cheaper unit in the same building</li>
        <li>They agree to modify the lease to a lower rent</li>
        <li>They let you terminate the lease with a reduced penalty</li>
      </ul>

      <h3>2. Find a Replacement Roommate</h3>
      <p>
        This is usually the fastest and cheapest solution. Post on Facebook groups, Craigslist,
        SpareRoom, Roomies, and your social networks. Your landlord will likely need to approve
        the new roommate (credit check, application, etc.), so start early.
      </p>
      <p>
        <strong>Key point:</strong> Even if your lease says no subletting, most landlords will
        allow a <strong>roommate replacement</strong> where the new person gets added to (or
        replaces someone on) the lease. These are two different things.
      </p>

      <h3>3. Understand Your Lease Terms</h3>
      <p>
        Read your lease for language about roommate changes, subletting, and early termination.
        Some leases have specific provisions for roommate departures. Others are silent on it,
        which usually means you need landlord approval for any changes.
      </p>

      <h2>Can You Sue Your Roommate?</h2>
      <p>
        <strong>Yes, potentially.</strong> If your roommate signed the lease and then abandoned
        their share of the rent, you may have a case in <strong>small claims court</strong>.
        Here&apos;s what matters:
      </p>
      <ul>
        <li>
          <strong>If they&apos;re on the lease:</strong> They are legally obligated to pay rent
          through the end of the lease term. You can sue them for their unpaid share.
        </li>
        <li>
          <strong>If you had a written roommate agreement:</strong> This strengthens your case
          significantly. Even an informal text or email confirming &quot;we each pay $1,200/month&quot;
          counts as evidence.
        </li>
        <li>
          <strong>If there&apos;s no written agreement:</strong> You can still sue, but it
          becomes a &quot;he said, she said&quot; situation. Courts generally still side with you
          if you can show they were on the lease and stopped paying.
        </li>
      </ul>
      <p>
        Small claims court filing fees are typically $30–$75, and you don&apos;t need a
        lawyer. The maximum you can sue for varies by state (usually $5,000–$10,000).
      </p>

      <h2>Your Options, Ranked</h2>
      <p>
        From best to worst outcome:
      </p>
      <ol>
        <li>
          <strong>Find a replacement roommate</strong> — The cheapest and fastest solution.
          Your landlord stays happy, you keep the apartment, and life continues.
        </li>
        <li>
          <strong>Negotiate a lease modification</strong> — Ask your landlord to reduce the
          rent to reflect a single-person occupancy, or move you to a cheaper unit.
        </li>
        <li>
          <strong>Break the lease together</strong> — If you can&apos;t afford the apartment
          alone, you may need to break the lease. The penalty falls on both tenants.
        </li>
        <li>
          <strong>Cover the full rent temporarily</strong> — If you can swing it for a month
          or two while finding a replacement, this avoids any disruption.
        </li>
        <li>
          <strong>Sue your roommate</strong> — A last resort, but a valid one if they owe
          you significant money.
        </li>
      </ol>

      <h2>How to Protect Yourself Next Time</h2>
      <ul>
        <li>
          <strong>Get a roommate agreement in writing.</strong> Spell out who pays what, what
          happens if someone leaves early, and how much notice is required. This takes 15
          minutes and can save you thousands.
        </li>
        <li>
          <strong>Push for individual leases</strong> when possible (rare, but ask).
        </li>
        <li>
          <strong>Have a financial buffer.</strong> If you rely on a roommate to afford your
          apartment, keep enough savings to cover 1–2 months of full rent in case they leave.
        </li>
        <li>
          <strong>Screen your roommates.</strong> This sounds extreme, but knowing someone
          for a weekend and signing a 12-month lease with them is how most roommate
          disasters start.
        </li>
        <li>
          <strong>Consider lease-break coverage.</strong> Products like LeaseFlex protect
          against the financial fallout when lease situations fall apart unexpectedly.
        </li>
      </ul>

      <h2>Bottom Line</h2>
      <p>
        If your roommate moved out, you are most likely responsible for the full rent.
        Don&apos;t panic — talk to your landlord immediately, start looking for a replacement
        roommate, and explore your options. Most of these situations are resolvable without
        breaking the lease, but you need to act fast.
      </p>
      <p>
        And if your roommate owes you money? Small claims court exists for exactly this
        situation.
      </p>
    </ArticleLayout>
  );
}
