import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'LeaseFlex — Break your lease without the penalty';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06), transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-80px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05), transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Logo — text only */}
        <span style={{ fontSize: '18px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '-0.02em', marginBottom: '40px' }}>
          leaseflex.io
        </span>

        {/* Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Break your lease
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#525252',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            without the penalty.
          </span>
        </div>

        {/* Subtext */}
        <span
          style={{
            marginTop: '32px',
            fontSize: '22px',
            color: '#737373',
            letterSpacing: '-0.01em',
          }}
        >
          Starting at $9/mo · See if you qualify in 60 seconds
        </span>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
            borderTop: '1px solid #f5f5f5',
          }}
        >
          <span style={{ fontSize: '14px', color: '#d4d4d4' }}>
            leaseflex.io · No credit check · Cancel anytime
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
