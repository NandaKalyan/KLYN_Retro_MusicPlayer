import { useMemo } from 'react';

interface TonearmProps {
  /** 0 = lifted (resting), 1 = dropped on record */
  dropAmount: number;
  size?: number;
}

const REST_ANGLE = 18;
const DROP_ANGLE = -22;

export default function Tonearm({ dropAmount, size = 440 }: TonearmProps) {
  const pivotX = size * 0.92;
  const pivotY = size * 0.12;
  const armLength = size * 0.62;
  const headshellOffset = size * 0.04;

  const armPath = useMemo(() => {
    const endX = pivotX - armLength * Math.cos((REST_ANGLE * Math.PI) / 180);
    const endY = pivotY + armLength * Math.sin((REST_ANGLE * Math.PI) / 180);
    return { endX, endY };
  }, [pivotX, pivotY, armLength]);

  const angle = REST_ANGLE + (DROP_ANGLE - REST_ANGLE) * dropAmount;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 20 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="armMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d8d2c8" />
          <stop offset="40%" stopColor="#a8a298" />
          <stop offset="70%" stopColor="#8a847a" />
          <stop offset="100%" stopColor="#c0bab0" />
        </linearGradient>
        <radialGradient id="pivotBase" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5a5248" />
          <stop offset="60%" stopColor="#3a342c" />
          <stop offset="100%" stopColor="#1a1612" />
        </radialGradient>
        <radialGradient id="counterweight" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#6a6258" />
          <stop offset="100%" stopColor="#2a241e" />
        </radialGradient>
      </defs>

      {/* Drop shadow beneath the arm — sells depth */}
      <g
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: `${pivotX}px ${pivotY}px`,
          transition: 'transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        {/* Shadow (offset down-right) */}
        <line
          x1={pivotX + 3}
          y1={pivotY + 5}
          x2={armPath.endX + 3}
          y2={armPath.endY + 5}
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Counterweight (behind pivot) */}
        <ellipse
          cx={pivotX + 14}
          cy={pivotY - 6}
          rx="16"
          ry="11"
          fill="url(#counterweight)"
          stroke="#1a1612"
          strokeWidth="0.5"
        />

        {/* Main arm tube */}
        <line
          x1={pivotX}
          y1={pivotY}
          x2={armPath.endX}
          y2={armPath.endY}
          stroke="url(#armMetal)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Headshell (S-curve hint) at the end */}
        <g>
          <rect
            x={armPath.endX - headshellOffset - 4}
            y={armPath.endY - 6}
            width="16"
            height="12"
            rx="2"
            fill="url(#armMetal)"
            stroke="#1a1612"
            strokeWidth="0.5"
            transform={`rotate(${REST_ANGLE} ${armPath.endX} ${armPath.endY})`}
          />
          {/* Needle tip — amber accent */}
          <circle
            cx={armPath.endX - 2}
            cy={armPath.endY + 4}
            r="2.5"
            fill="#e0a85a"
            opacity={0.4 + dropAmount * 0.6}
            style={{ transition: 'opacity 0.8s ease' }}
          />
        </g>
      </g>

      {/* Pivot base — fixed, does not rotate */}
      <circle
        cx={pivotX}
        cy={pivotY}
        r="13"
        fill="url(#pivotBase)"
        stroke="#0d0a08"
        strokeWidth="1"
      />
      <circle cx={pivotX} cy={pivotY} r="4" fill="#e0a85a" opacity="0.5" />
    </svg>
  );
}
