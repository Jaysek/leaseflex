import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Property Owners — LeaseFlex',
  description:
    'Offer flexible leasing as a tenant amenity. Fill vacancies faster, attract better tenants, and stay financially protected — at zero cost to you.',
};

export default function LandlordsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
