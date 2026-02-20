import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getResend, isResendConfigured } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { offer_id, email, monthly_price, coverage_cap, city, state, address } =
      await request.json();

    if (!email || !offer_id) {
      return NextResponse.json(
        { error: 'Email and offer_id are required' },
        { status: 400 }
      );
    }

    // Update offer with email and status
    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('offers')
        .update({ email, status: 'emailed' })
        .eq('id', offer_id);
    }

    // Send real email if Resend is configured
    if (isResendConfigured()) {
      const resend = getResend()!;
      const location = [address, city, state].filter(Boolean).join(', ');

      await resend.emails.send({
        from: 'LeaseFlex <noreply@leaseflex.com>',
        to: email,
        subject: `Your LeaseFlex offer — $${monthly_price}/mo`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <p style="font-size: 12px; font-weight: 600; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">You're approved</p>
              <h1 style="font-size: 28px; font-weight: 700; color: #171717; margin: 0;">Exit your lease for $${monthly_price}/mo</h1>
              ${location ? `<p style="font-size: 14px; color: #a3a3a3; margin-top: 8px;">${location}</p>` : ''}
            </div>

            <div style="background: #fafafa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #737373;">Monthly price</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #171717; text-align: right;">$${monthly_price}/mo</td>
                </tr>
                ${coverage_cap ? `<tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #737373;">Coverage cap</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #171717; text-align: right;">$${Number(coverage_cap).toLocaleString()}</td>
                </tr>` : ''}
              </table>
            </div>

            <div style="text-align: center; margin-bottom: 32px;">
              <p style="font-size: 12px; color: #a3a3a3;">This offer is locked for 48 hours. Rates may change based on demand.</p>
            </div>

            <div style="text-align: center; font-size: 11px; color: #d4d4d4; margin-top: 40px;">
              <p>LeaseFlex &mdash; Mobility protection for renters</p>
            </div>
          </div>
        `,
      });

      return NextResponse.json({ success: true, message: 'Offer emailed' });
    }

    // Fallback: no Resend key
    console.log(`[STUB] Would send offer ${offer_id} to ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Offer emailed (Resend not configured — stub mode)',
    });
  } catch (err) {
    console.error('Email offer error:', err);
    return NextResponse.json(
      { error: 'Failed to email offer' },
      { status: 500 }
    );
  }
}
