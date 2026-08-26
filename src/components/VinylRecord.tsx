import { useMemo } from 'react';

interface VinylRecordProps {
  rotation: number;
  artUrl: string;
  crossfadeArt: string | null;
  size?: number;
}

export default function VinylRecord({
  rotation,
  artUrl,
  crossfadeArt,
  size = 440,
}: VinylRecordProps) {
  // Generate groove ring circles — subtle, thin, low contrast
  const grooves = useMemo(() => {
    const rings = [];
    const innerRadius = size * 0.28;
    const outerRadius = size * 0.48;
    const count = 14;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const r = innerRadius + (outerRadius - innerRadius) * t;
      const opacity = 0.04 + t * 0.06;
      rings.push({ r, opacity, key: i });
    }
    return rings;
  }, [size]);

  const center = size / 2;
  const labelRadius = size * 0.27;
  const artDiameter = labelRadius * 2;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Outer vinyl disc with subtle radial sheen */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #1a1612 0%, #0d0b09 55%, #060504 100%)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      />

      {/* Rotating layer: grooves + album art + center label */}
      <div
        className="absolute inset-0"
        style={{
          transform: `rotate(${rotation}deg)`,
          willChange: 'transform',
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
        >
          {/* Groove rings */}
          {grooves.map((g) => (
            <circle
              key={g.key}
              cx={center}
              cy={center}
              r={g.r}
              fill="none"
              stroke="#e0d0b8"
              strokeWidth="0.5"
              opacity={g.opacity}
            />
          ))}

          {/* Slight light catch — a faint highlight arc that rotates with the disc */}
          <defs>
            <radialGradient id="sheen" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0)" />
              <stop offset="85%" stopColor="rgba(255,240,220,0.03)" />
              <stop offset="100%" stopColor="rgba(255,240,220,0)" />
            </radialGradient>
          </defs>
          <circle cx={center} cy={center} r={size * 0.48} fill="url(#sheen)" />
        </svg>

        {/* Album art — circular label, crossfade layer */}
        <div
          className="absolute"
          style={{
            top: center - labelRadius,
            left: center - labelRadius,
            width: artDiameter,
            height: artDiameter,
          }}
        >
          {/* Outgoing (fading) art */}
          {crossfadeArt && (
            <img
              src={crossfadeArt}
              alt=""
              className="absolute inset-0 w-full h-full rounded-full object-cover"
              style={{
                animation: 'klynArtFadeOut 0.7s ease forwards',
              }}
            />
          )}
          {/* Incoming art */}
          <img
            src={artUrl}
            alt="Album artwork"
            className="absolute inset-0 w-full h-full rounded-full object-cover"
            style={{
              animation: crossfadeArt
                ? 'klynArtFadeIn 0.7s ease forwards'
                : 'none',
            }}
          />
          {/* Inner ring border around the label */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow:
                'inset 0 0 0 1px rgba(0,0,0,0.6), inset 0 0 12px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Center spindle hole */}
        <div
          className="absolute rounded-full"
          style={{
            top: center - 4,
            left: center - 4,
            width: 8,
            height: 8,
            background: '#060504',
            boxShadow: '0 0 0 1px rgba(224,168,90,0.3)',
          }}
        />
      </div>
    </div>
  );
}
