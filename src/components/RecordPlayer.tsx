import VinylRecord from './VinylRecord';
import Tonearm from './Tonearm';

interface RecordPlayerProps {
  rotation: number;
  artUrl: string;
  crossfadeArt: string | null;
  spinSpeed: number;
  armDrop: number;
  size?: number;
}

export default function RecordPlayer({
  rotation,
  artUrl,
  crossfadeArt,
  spinSpeed,
  armDrop,
  size = 440,
}: RecordPlayerProps) {
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Platter base — subtle brushed metal ring beneath the record */}
      <div
        className="absolute rounded-full"
        style={{
          inset: -8,
          background:
            'radial-gradient(circle at 50% 50%, #2a221a 0%, #1a1612 70%, #0d0a08 100%)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.03), 0 30px 80px rgba(0,0,0,0.6)',
        }}
      />

      <VinylRecord
        rotation={rotation}
        artUrl={artUrl}
        crossfadeArt={crossfadeArt}
        size={size}
      />

      <Tonearm dropAmount={armDrop} size={size} />
    </div>
  );
}
