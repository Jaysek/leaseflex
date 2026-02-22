export type SubletAllowed = 'yes' | 'no' | 'unknown';

export type OfferStatus = 'quoted' | 'emailed' | 'started_checkout' | 'waitlist';

export interface QuoteInput {
  monthly_rent: number;
  address: string;
  city: string;
  state: string;
  lease_start_date: string; // ISO date
  lease_end_date: string;   // ISO date
  early_termination_fee_known?: boolean;
  early_termination_fee_amount?: number;
  sublet_allowed?: SubletAllowed;
}

export interface OfferPayload {
  id?: string;
  created_at?: string;
  full_name?: string | null;
  email?: string | null;
  monthly_rent: number;
  address: string;
  city: string;
  state: string;
  lease_start_date: string;
  lease_end_date: string;
  months_remaining: number;
  termination_fee_known: boolean;
  termination_fee_amount: number | null;
  sublet_allowed: SubletAllowed;
  risk_score: number;
  flex_score: number;
  monthly_price: number;
  coverage_cap: number;
  deductible: number;
  waiting_period_days: number;
  status: OfferStatus;
  requires_manual_review: boolean;
  requires_concierge: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateQuoteInput(input: QuoteInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.monthly_rent || input.monthly_rent < 500 || input.monthly_rent > 50000) {
    errors.push({ field: 'monthly_rent', message: 'Monthly rent must be between $500 and $50,000' });
  }
  if (!input.address || input.address.trim().length === 0) {
    errors.push({ field: 'address', message: 'Rental address is required' });
  }
  if (!input.city || input.city.trim().length === 0) {
    errors.push({ field: 'city', message: 'City is required' });
  }
  if (!input.state || input.state.trim().length === 0) {
    errors.push({ field: 'state', message: 'State is required' });
  }
  if (!input.lease_start_date) {
    errors.push({ field: 'lease_start_date', message: 'Lease start date is required' });
  }
  if (!input.lease_end_date) {
    errors.push({ field: 'lease_end_date', message: 'Lease end date is required' });
  }
  if (input.lease_start_date && input.lease_end_date) {
    const start = new Date(input.lease_start_date);
    const end = new Date(input.lease_end_date);
    if (end <= start) {
      errors.push({ field: 'lease_end_date', message: 'Lease end date must be after start date' });
    }
  }
  if (input.early_termination_fee_known && input.early_termination_fee_amount != null && input.early_termination_fee_amount < 0) {
    errors.push({ field: 'early_termination_fee_amount', message: 'Termination fee cannot be negative' });
  }

  return errors;
}
