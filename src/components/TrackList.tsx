import { formatTime } from '@/utils/format';
import type { Track } from '@/data/tracks';
import type { PlaybackState } from '@/hooks/useTurntable';

interface TrackListProps {
  tracks: Track[];
  currentIndex: number;
  playbackState: PlaybackState;
  durations: Record<string, number>;
  onSelect: (index: number) => void;
}

export default function TrackList({
  tracks,
  currentIndex,
  playbackState,
  durations,
  onSelect,
}: TrackListProps) {
  return (
    <div className="w-full">
      <h3 className="text-xs uppercase tracking-[0.2em] text-ink-600 mb-4 pl-1">
        Side A
      </h3>
      <ul className="space-y-1">
        {tracks.map((track, i) => {
          const isActive = i === currentIndex;
          const isPlaying = isActive && playbackState === 'playing';
          const dur = durations[track.id];
          return (
            <li key={track.id}>
              <button
                onClick={() => onSelect(i)}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 group"
                style={{
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(224,168,90,0.08), transparent)'
                    : 'transparent',
                }}
              >
                {/* Index / playing indicator */}
                <span className="w-6 text-center text-sm tabular-nums">
                  {isPlaying ? (
                    <span className="inline-flex gap-[2px] items-end h-4">
                      <span
                        className="w-[2px] bg-amber-accent rounded-full"
                        style={{
                          height: '40%',
                          animation: 'klynBar 0.6s ease-in-out infinite alternate',
                        }}
                      />
                      <span
                        className="w-[2px] bg-amber-accent rounded-full"
                        style={{
                          height: '75%',
                          animation: 'klynBar 0.6s ease-in-out infinite alternate',
                          animationDelay: '0.2s',
                        }}
                      />
                      <span
                        className="w-[2px] bg-amber-accent rounded-full"
                        style={{
                          height: '55%',
                          animation: 'klynBar 0.6s ease-in-out infinite alternate',
                          animationDelay: '0.4s',
                        }}
                      />
                    </span>
                  ) : (
                    <span
                      className={isActive ? 'text-amber-accent' : 'text-ink-600'}
                    >
                      {i + 1}
                    </span>
                  )}
                </span>

                {/* Title + artist */}
                <span className="flex-1 min-w-0">
                  <span
                    className={
                      'block text-sm truncate ' +
                      (isActive
                        ? 'text-amber-accent'
                        : 'text-ink-700 group-hover:text-amber-accent')
                    }
                  >
                    {track.title}
                  </span>
                  <span className="block text-xs text-ink-600 truncate">
                    {track.artist}
                  </span>
                </span>

                {/* Duration */}
                <span className="text-xs text-ink-600 tabular-nums">
                  {dur ? formatTime(dur) : '--:--'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
