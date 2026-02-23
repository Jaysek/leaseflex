export const DEDUCTIBLE = 1500;
export const MAX_CLAIMS_PER_TERM = 1;
export const WAITING_PERIOD_DEFAULT = 60;
export const WAITING_PERIOD_MANUAL_REVIEW = 180;
export const MINIMUM_COMMITMENT_DAYS = 90;
export const MONTHS_REMAINING_MANUAL_REVIEW_THRESHOLD = 3;
export const RENT_CONCIERGE_THRESHOLD = 15000;
export const PRICE_CEILING = 199;
export const COVERAGE_CAP_MAX = 15000;
export const COVERAGE_CAP_MONTHS = 1;

export const PRICING_TIERS = [
  { min: 1500, max: 2999, price: 19 },
  { min: 3000, max: 5999, price: 39 },
  { min: 6000, max: 9999, price: 79 },
  { min: 10000, max: Infinity, price: 149 },
] as const;

export const RISK_ADD_ON_TIERS = [
  { min: 70, max: 100, addon: 30 },
  { min: 50, max: 69, addon: 15 },
  { min: 30, max: 49, addon: 5 },
  { min: 0, max: 29, addon: 0 },
] as const;

export const COVERED_ITEMS = [
  'Lease break penalties',
  'Early termination fees',
  'Remaining rent obligations (capped)',
];

export const NOT_COVERED_ITEMS = [
  'Moving costs',
  'Security deposits',
  'Damages',
  'Utilities',
];

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];
