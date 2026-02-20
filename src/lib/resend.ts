import { Resend } from 'resend';

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
