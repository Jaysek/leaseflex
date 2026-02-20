import {
  DEDUCTIBLE,
  WAITING_PERIOD_DEFAULT,
  WAITING_PERIOD_MANUAL_REVIEW,
  MONTHS_REMAINING_MANUAL_REVIEW_THRESHOLD,
  RENT_CONCIERGE_THRESHOLD,
  PRICE_CEILING,
  COVERAGE_CAP_MAX,
  COVERAGE_CAP_MONTHS,
  PRICING_TIERS,
  RISK_ADD_ON_TIERS,
} from './constants';
import type { QuoteInput, OfferPayload, SubletAllowed } from './types';

export function computeMonthsRemaining(leaseEndDate: string): number {
  const now = new Date();
  const end = new Date(leaseEndDate);
  const diffMs = end.getTime() - now.getTime();
  const months = diffMs / (1000 * 60 * 60 * 24 * 30.44);
  return Math.max(0, Math.round(months));
}

export function computeRiskScore({
  rent,
  monthsRemaining,
  subletAllowed,
  terminationFeeKnown,
}: {
  rent: number;
  monthsRemaining: number;
  subletAllowed: SubletAllowed;
  terminationFeeKnown: boolean;
}): number {
  let score = 0;

  // Rent factor
  if (rent < 2000) score += 5;
  else if (rent < 4000) score += 10;
  else if (rent < 7000) score += 20;
  else if (rent < 10000) score += 30;
  else score += 40;

  // Months remaining factor
  if (monthsRemaining <= 3) score += 35;
  else if (monthsRemaining <= 6) score += 20;
  else if (monthsRemaining <= 12) score += 10;
  else score += 5;

  // Sublet factor
  if (subletAllowed === 'yes') score -= 10;
  else if (subletAllowed === 'no') score += 10;
  else score += 5; // unknown

  // Termination fee known factor
  if (terminationFeeKnown) score -= 5;
  else score += 5;

  return Math.max(0, Math.min(100, score));
}

export function computeFlexScore(riskScore: number): number {
  return 100 - riskScore;
}

export function computeMonthlyPrice(rent: number, riskScore: number): number {
  // Find base price from tier
  let basePrice = 12; // default fallback
  for (const tier of PRICING_TIERS) {
    if (rent >= tier.min && rent <= tier.max) {
      basePrice = tier.price;
      break;
    }
  }

  // Below minimum tier
  if (rent < 1500) {
    basePrice = 12;
  }

  // Risk add-on only for $10k+ tier
  let addon = 0;
  if (rent >= 10000) {
    for (const tier of RISK_ADD_ON_TIERS) {
      if (riskScore >= tier.min && riskScore <= tier.max) {
        addon = tier.addon;
        break;
      }
    }
  }

  return Math.min(basePrice + addon, PRICE_CEILING);
}

export function computeCoverageCap(rent: number): number {
  return Math.min(rent * COVERAGE_CAP_MONTHS, COVERAGE_CAP_MAX);
}

export function computeWaitingPeriod(monthsRemaining: number): number {
  if (monthsRemaining <= MONTHS_REMAINING_MANUAL_REVIEW_THRESHOLD) {
    return WAITING_PERIOD_MANUAL_REVIEW;
  }
  return WAITING_PERIOD_DEFAULT;
}

export function generateOffer(input: QuoteInput): OfferPayload {
  const monthsRemaining = computeMonthsRemaining(input.lease_end_date);
  const subletAllowed: SubletAllowed = input.sublet_allowed ?? 'unknown';
  const terminationFeeKnown = input.early_termination_fee_known ?? false;

  const riskScore = computeRiskScore({
    rent: input.monthly_rent,
    monthsRemaining,
    subletAllowed,
    terminationFeeKnown,
  });

  const flexScore = computeFlexScore(riskScore);
  const monthlyPrice = computeMonthlyPrice(input.monthly_rent, riskScore);
  const coverageCap = computeCoverageCap(input.monthly_rent);
  const waitingPeriodDays = computeWaitingPeriod(monthsRemaining);
  const requiresManualReview = monthsRemaining <= MONTHS_REMAINING_MANUAL_REVIEW_THRESHOLD;
  const requiresConcierge = input.monthly_rent >= RENT_CONCIERGE_THRESHOLD;

  return {
    monthly_rent: input.monthly_rent,
    address: input.address,
    city: input.city,
    state: input.state,
    lease_start_date: input.lease_start_date,
    lease_end_date: input.lease_end_date,
    months_remaining: monthsRemaining,
    termination_fee_known: terminationFeeKnown,
    termination_fee_amount: input.early_termination_fee_amount ?? null,
    sublet_allowed: subletAllowed,
    risk_score: riskScore,
    flex_score: flexScore,
    monthly_price: monthlyPrice,
    coverage_cap: coverageCap,
    deductible: DEDUCTIBLE,
    waiting_period_days: waitingPeriodDays,
    status: 'quoted',
    requires_manual_review: requiresManualReview,
    requires_concierge: requiresConcierge,
  };
}
