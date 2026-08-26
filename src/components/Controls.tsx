import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Loader2, AlertCircle } from 'lucide-react';
import { formatTime } from '@/utils/format';
import type { Track } from '@/data/tracks';
import type { PlaybackState } from '@/hooks/useTurntable';

interface ControlsProps {
  playbackState: PlaybackState;
  currentTrack: Track;
  progress: number;
  duration: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
}

export default function Controls({
  playbackState,
  currentTrack,
  progress,
  duration,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
}: ControlsProps) {
  const [hovering, setHovering] = useState(false);
  const isPlaying = playbackState === 'playing';
  const isLoading = playbackState === 'loading' || playbackState === 'dropping';
  const isError = playbackState === 'error';
  const effectiveDuration = duration || 0;
  const pct = effectiveDuration > 0 ? Math.min((progress / effectiveDuration) * 100, 100) : 0;
  const seekDisabled = effectiveDuration === 0;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Track info */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl text-amber-accent tracking-wide">
          {currentTrack.title}
        </h2>
        <p className="text-sm text-ink-600 mt-1">
          {currentTrack.artist} — {currentTrack.album}
        </p>
        {isError && (
          <p className="text-xs text-red-400/80 mt-2 flex items-center justify-center gap-1.5">
            <AlertCircle size={12} />
            Unable to load audio — add the file to public/audio/
          </p>
        )}
      </div>

      {/* Scrubber */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-ink-600 tabular-nums w-10 text-right">
          {formatTime(progress)}
        </span>
        <input
          type="range"
          min={0}
          max={effectiveDuration || 0}
          value={progress}
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={seekDisabled}
          className="klyn-slider flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ ['--progress' as string]: `${pct}%` }}
          aria-label="Seek"
        />
        <span className="text-xs text-ink-600 tabular-nums w-10">
          {formatTime(effectiveDuration)}
        </span>
      </div>

      {/* Transport buttons */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onPrev}
          className="p-3 rounded-full text-ink-600 hover:text-amber-accent transition-colors duration-200"
          aria-label="Previous track"
        >
          <SkipBack size={22} fill="currentColor" />
        </button>

        <button
          onClick={onTogglePlay}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          disabled={isLoading}
          className="relative p-5 rounded-full transition-all duration-300 group disabled:opacity-60"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, #2a221a, #14100c)',
            boxShadow: hovering && !isLoading
              ? '0 0 0 1px rgba(224,168,90,0.4), 0 4px 20px rgba(224,168,90,0.2), inset 0 1px 1px rgba(255,255,255,0.06)'
              : '0 0 0 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.04)',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <Loader2 size={28} className="text-amber-accent animate-spin" />
          ) : isPlaying ? (
            <Pause size={28} className="text-amber-accent" fill="currentColor" />
          ) : (
            <Play size={28} className="text-amber-accent ml-1" fill="currentColor" />
          )}
        </button>

        <button
          onClick={onNext}
          className="p-3 rounded-full text-ink-600 hover:text-amber-accent transition-colors duration-200"
          aria-label="Next track"
        >
          <SkipForward size={22} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
