import { track as vercelTrack } from '@vercel/analytics';

export function track(event: string, properties?: Record<string, string | number | boolean>) {
  try {
    vercelTrack(event, properties);
  } catch {
    // silent in dev / SSR
  }
}
