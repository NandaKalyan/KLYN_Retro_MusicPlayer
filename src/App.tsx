import { useState, useEffect, useRef } from 'react';
import { Disc3 } from 'lucide-react';
import { tracks } from '@/data/tracks';
import { useTurntable } from '@/hooks/useTurntable';
import RecordPlayer from '@/components/RecordPlayer';
import Controls from '@/components/Controls';
import TrackList from '@/components/TrackList';
import FeatureSection from '@/components/FeatureSection';

function App() {
  const { state, togglePlay, next, prev, selectTrack, seek } = useTurntable(tracks);
  const [recordSize, setRecordSize] = useState(440);
  const durationsRef = useRef<Record<string, number>>({});
  const [, forceUpdate] = useState(0);

  // Collect durations per track as they load — we probe each track's metadata
  // by creating temporary Audio objects so the track list can show real durations
  // without the user having to play each track.
  useEffect(() => {
    const cleanupFns: (() => void)[] = [];
    tracks.forEach((track) => {
      const probe = new Audio();
      probe.preload = 'metadata';
      probe.src = track.src;
      const onLoaded = () => {
        if (probe.duration && !isNaN(probe.duration)) {
          durationsRef.current[track.id] = probe.duration;
          forceUpdate((n) => n + 1);
        }
      };
      probe.addEventListener('loadedmetadata', onLoaded);
      cleanupFns.push(() => {
        probe.removeEventListener('loadedmetadata', onLoaded);
        probe.src = '';
      });
    });
    return () => cleanupFns.forEach((fn) => fn());
  }, []);

  // Also update durationsRef when the hook reports a duration for the current track
  useEffect(() => {
    if (state.duration > 0) {
      durationsRef.current[state.currentTrack.id] = state.duration;
    }
  }, [state.duration, state.currentTrack.id]);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 400) setRecordSize(280);
      else if (w < 640) setRecordSize(320);
      else if (w < 1024) setRecordSize(380);
      else setRecordSize(440);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Ambient warm glow behind the record */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 35%, rgba(184,118,46,0.06), transparent 70%)',
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6">
        <div className="flex items-center gap-2.5">
          <Disc3 size={22} className="text-amber-accent" />
          <span className="font-display text-xl tracking-[0.15em] text-ink-700">
            KLYN
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-ink-600">
          <a href="#player" className="hover:text-amber-accent transition-colors">
            Player
          </a>
          <a href="#features" className="hover:text-amber-accent transition-colors">
            Details
          </a>
          <button className="px-4 py-2 rounded-full text-ink-700 border border-ink-600 hover:border-amber-accent hover:text-amber-accent transition-all duration-200">
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero / Player */}
      <section
        id="player"
        className="relative z-10 flex flex-col items-center pt-8 pb-16 px-6"
      >
        <div className="text-center mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-accent mb-4">
            A record player for your music
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight text-balance">
            Play it like you mean it
          </h1>
          <p className="text-ink-600 mt-4 text-base md:text-lg leading-relaxed text-balance">
            KLYN brings the warmth and ritual of vinyl to digital listening.
            Press play and the record spins up. Hit pause and it coasts to a stop.
          </p>
        </div>

        {/* Record player + track list */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 w-full max-w-5xl">
          <div className="flex-shrink-0">
            <RecordPlayer
              rotation={state.rotation}
              artUrl={state.currentTrack.art}
              crossfadeArt={state.crossfadeArt}
              spinSpeed={state.spinSpeed}
              armDrop={state.armDrop}
              size={recordSize}
            />
          </div>

          {/* Track list — visible on large screens beside the record, below on mobile */}
          <div className="w-full max-w-xs">
            <TrackList
              tracks={tracks}
              currentIndex={state.trackIndex}
              playbackState={state.playbackState}
              durations={durationsRef.current}
              onSelect={selectTrack}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 w-full max-w-5xl">
          <Controls
            playbackState={state.playbackState}
            currentTrack={state.currentTrack}
            progress={state.progress}
            duration={state.duration}
            onTogglePlay={togglePlay}
            onNext={next}
            onPrev={prev}
            onSeek={seek}
          />
        </div>
      </section>

      {/* Features */}
      <div id="features">
        <FeatureSection />
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ink-800 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Disc3 size={16} className="text-amber-accent" />
            <span className="font-display text-sm tracking-[0.15em] text-ink-600">
              KLYN
            </span>
          </div>
          <p className="text-xs text-ink-600">
            A prototype record player experience.
          </p>
        </div>
      </footer>

      {/* Grain overlay */}
      <div className="grain-overlay" />
    </div>
  );
}

export default App;
