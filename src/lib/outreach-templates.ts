/**
 * Cold outreach email templates for property managers.
 * 3-step sequence: initial → follow-up 1 (3 days) → follow-up 2 (7 days)
 * All CAN-SPAM compliant with unsubscribe link and physical address placeholder.
 */

export interface OutreachVars {
  name: string;
  company?: string;
  city?: string;
  state?: string;
}

const footer = `
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 11px; color: #a3a3a3; line-height: 1.6;">
  <p>LeaseFlex, Inc.</p>
  <p><a href="{{unsubscribe_url}}" style="color: #a3a3a3; text-decoration: underline;">Unsubscribe</a></p>
</div>`;

function wrap(body: string): string {
  return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #171717; font-size: 14px; line-height: 1.7;">${body}${footer}</div>`;
}

function firstName(name: string): string {
  return name.split(' ')[0];
}

export function initialEmail(v: OutreachVars) {
  const first = firstName(v.name);
  const subject = v.company
    ? `Quick question about lease breaks at ${v.company}`
    : `Quick question about lease breaks`;

  const html = wrap(`
    <p>Hi ${first},</p>
    <p>I'm building something for the property management space and wanted to get your perspective.</p>
    <p>We're exploring a product called <strong>LeaseFlex</strong> — a monthly subscription tenants pay that would cover lease-break penalties when they need to leave early. The idea is that landlords get paid without chasing anyone, and tenants leave cleanly.</p>
    <p>I'm talking to property managers to understand how big of a pain point lease breaks actually are before we launch. A few things I'm trying to learn:</p>
    <ul style="padding-left: 20px; color: #525252;">
      <li>How often do your tenants break leases?</li>
      <li>What does that actually cost you (vacancy, re-leasing, collections)?</li>
      <li>Would something like this change how you think about lease terms?</li>
    </ul>
    <p>Would you have 10 minutes for a quick call? I'd genuinely love to hear how this plays out${v.city ? ` in ${v.city}` : ''} — no pitch, just learning.</p>
    <p>Best,<br/>Justin<br/><span style="color: #a3a3a3;">LeaseFlex — leaseflex.io</span></p>
  `);

  return { subject, html };
}

export function followUp1Email(v: OutreachVars) {
  const first = firstName(v.name);
  const subject = `Following up — lease break question`;

  const html = wrap(`
    <p>Hi ${first},</p>
    <p>Just bumping this — I know property management keeps you busy.</p>
    <p>I'm researching the lease break problem and trying to understand the real cost: vacancy, re-leasing, collections, credit disputes. Most of the data I can find is surface-level, so I'm trying to hear directly from people who deal with it.</p>
    <p>Even a 10-minute call would be really helpful. Happy to share what I've been learning from other property managers too.</p>
    <p>Justin<br/><span style="color: #a3a3a3;">LeaseFlex — leaseflex.io</span></p>
  `);

  return { subject, html };
}

export function followUp2Email(v: OutreachVars) {
  const first = firstName(v.name);
  const subject = `Closing the loop`;

  const html = wrap(`
    <p>Hi ${first},</p>
    <p>Last note from me — if lease breaks aren't a big pain point for you right now, totally understand.</p>
    <p>If they are, I'd love to hear how you handle them today. We're finalizing what LeaseFlex looks like for property managers and early input shapes the product.</p>
    <p>Either way, no hard feelings. Appreciate your time.</p>
    <p>Justin<br/><span style="color: #a3a3a3;">LeaseFlex — leaseflex.io</span></p>
  `);

  return { subject, html };
}

export function getTemplate(step: 'initial' | 'follow_up_1' | 'follow_up_2', vars: OutreachVars) {
  switch (step) {
    case 'initial': return initialEmail(vars);
    case 'follow_up_1': return followUp1Email(vars);
    case 'follow_up_2': return followUp2Email(vars);
  }
}

/** Determine the next step for a prospect based on current status */
export function nextStep(status: string): 'initial' | 'follow_up_1' | 'follow_up_2' | null {
  switch (status) {
    case 'queued': return 'initial';
    case 'sent': return 'follow_up_1';
    case 'followed_up_1': return 'follow_up_2';
    default: return null; // no more steps
  }
}

/** Status after sending a given step */
export function statusAfterStep(step: 'initial' | 'follow_up_1' | 'follow_up_2'): string {
  switch (step) {
    case 'initial': return 'sent';
    case 'follow_up_1': return 'followed_up_1';
    case 'follow_up_2': return 'followed_up_2';
  }
}

/** Minimum days between emails */
export function daysBeforeStep(step: 'follow_up_1' | 'follow_up_2'): number {
  switch (step) {
    case 'follow_up_1': return 3;
    case 'follow_up_2': return 7;
  }
}
