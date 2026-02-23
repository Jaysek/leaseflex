/**
 * LeaseFlex Underwriting Model
 *
 * Runs loss-ratio and break-even analysis across all pricing tiers.
 * This is an internal tool — not user-facing.
 */

// ── Assumptions ────────────────────────────────────────────────────
export const ASSUMPTIONS = {
  // General population early lease break rate (per year)
  // Source: ~45% don't renew, but most are natural expirations.
  // Industry estimate for *early* breaks: 10–15%.
  baseBreakRate: 0.12,

  // Adverse selection multiplier.
  // People who buy lease-break protection are self-selected —
  // they think they might need it. 2x is conservative.
  adverseSelectionMultiplier: 2.0,

  // Qualifying event filter.
  // Only covered reasons count (job relocation, job loss, medical,
  // domestic violence, military). Voluntary moves are excluded.
  // Estimate: ~55% of all early breaks have a qualifying reason.
  qualifyingEventRate: 0.55,

  // Waiting period survival.
  // 60-day waiting period filters out people who break very early.
  // ~85% of claimants make it past the waiting period.
  waitingPeriodSurvival: 0.85,

  // Deductible deterrence.
  // $500 deductible discourages small claims. ~90% still file.
  deductibleFilter: 0.90,

  // Average penalty as multiple of monthly rent (industry: 1–3 months, typical: 2).
  avgPenaltyMonths: 2,

  // Deductible amount
  deductible: 750,

  // Coverage cap multiplier
  coverageCapMultiplier: 1,
  coverageCapMax: 15_000,

  // Target loss ratio for sustainable insurance (industry standard: 50–65%)
  targetLossRatio: 0.60,

  // Annual subscriber churn (cancel without claim)
  annualChurnRate: 0.30,
};

// ── Tier Definitions ───────────────────────────────────────────────
export interface Tier {
  label: string;
  rentMin: number;
  rentMax: number;
  avgRent: number;
  currentPrice: number;
}

export const TIERS: Tier[] = [
  { label: '$1.5k–$3k rent', rentMin: 1500, rentMax: 2999, avgRent: 2250, currentPrice: 19 },
  { label: '$3k–$6k rent',   rentMin: 3000, rentMax: 5999, avgRent: 4000, currentPrice: 39 },
  { label: '$6k–$10k rent',  rentMin: 6000, rentMax: 9999, avgRent: 7500, currentPrice: 79 },
  { label: '$10k+ rent',     rentMin: 10000, rentMax: 20000, avgRent: 12000, currentPrice: 149 },
];

// ── Model ──────────────────────────────────────────────────────────
export interface TierAnalysis {
  tier: Tier;
  coverageCap: number;
  avgPayout: number;
  annualClaimRate: number;
  annualPremium: number;
  revenuePerHundred: number;
  claimsPerHundred: number;
  claimsCostPerHundred: number;
  lossRatio: number;
  breakEvenPrice: number;
  maxSafeClaimRate: number;
}

export function computeAnnualClaimRate(a = ASSUMPTIONS): number {
  return (
    a.baseBreakRate *
    a.adverseSelectionMultiplier *
    a.qualifyingEventRate *
    a.waitingPeriodSurvival *
    a.deductibleFilter
  );
}

export function computeAvgPayout(avgRent: number, a = ASSUMPTIONS): number {
  const penalty = avgRent * a.avgPenaltyMonths;
  const cap = Math.min(avgRent * a.coverageCapMultiplier, a.coverageCapMax);
  const claimAmount = Math.min(penalty, cap);
  return Math.max(0, claimAmount - a.deductible);
}

export function analyzeTier(tier: Tier, a = ASSUMPTIONS): TierAnalysis {
  const annualClaimRate = computeAnnualClaimRate(a);
  const avgPayout = computeAvgPayout(tier.avgRent, a);
  const coverageCap = Math.min(tier.avgRent * a.coverageCapMultiplier, a.coverageCapMax);
  const annualPremium = tier.currentPrice * 12;

  // Per 100 subscribers per year
  const revenuePerHundred = 100 * annualPremium;
  const claimsPerHundred = 100 * annualClaimRate;
  const claimsCostPerHundred = claimsPerHundred * avgPayout;
  const lossRatio = claimsCostPerHundred / revenuePerHundred;

  // What price makes this tier viable at target loss ratio?
  const breakEvenPrice = (avgPayout * annualClaimRate) / a.targetLossRatio / 12;

  // What claim rate keeps current pricing viable?
  const maxSafeClaimRate = (annualPremium * a.targetLossRatio) / avgPayout;

  return {
    tier,
    coverageCap,
    avgPayout,
    annualClaimRate,
    annualPremium,
    revenuePerHundred,
    claimsPerHundred,
    claimsCostPerHundred,
    lossRatio,
    breakEvenPrice: Math.ceil(breakEvenPrice),
    maxSafeClaimRate,
  };
}

export function runFullAnalysis(a = ASSUMPTIONS) {
  return TIERS.map((tier) => analyzeTier(tier, a));
}

// ── Scenario Runner ────────────────────────────────────────────────
export function runScenario(overrides: Partial<typeof ASSUMPTIONS>) {
  const a = { ...ASSUMPTIONS, ...overrides };
  return {
    assumptions: a,
    annualClaimRate: computeAnnualClaimRate(a),
    tiers: TIERS.map((tier) => analyzeTier(tier, a)),
  };
}
