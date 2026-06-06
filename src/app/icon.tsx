import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          fontFamily: 'sans-serif',
          fontWeight: 800,
          color: '#facc15',
          letterSpacing: '-0.5px',
        }}
      >
        R
      </div>
    ),
    {
      ...size,
    }
  );
}
