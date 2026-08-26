import { useCallback, useEffect, useRef, useState } from 'react';
import type { Track } from '@/data/tracks';

export type PlaybackState =
  | 'idle'
  | 'playing'
  | 'spinning-down'
  | 'loading'
  | 'error'
  | 'dropping';

interface TurntableState {
  rotation: number;
  playbackState: PlaybackState;
  currentTrack: Track;
  trackIndex: number;
  progress: number;
  duration: number;
  crossfadeArt: string | null;
  spinSpeed: number;
  armDrop: number;
}

const SPIN_RATE = 0.06;
const ACCEL_DURATION = 2200;
const DECEL_DURATION = 2600;
const ARM_DURATION = 1400;

const CRACKLE_SRC = '/audio/vinyl-crackle.mp3';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
function easeInCubic(t: number): number {
  return Math.pow(t, 3);
}

export function useTurntable(tracks: Track[]) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [rotation, setRotation] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [crossfadeArt, setCrossfadeArt] = useState<string | null>(null);
  const [spinSpeed, setSpinSpeed] = useState(0);
  const [armDrop, setArmDrop] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const crackleRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const phaseStartRef = useRef<number>(0);
  const phaseFromSpeedRef = useRef<number>(0);
  const targetSpeedRef = useRef<number>(0);
  const currentSpeedRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const trackIndexRef = useRef<number>(0);
  const crossfadeTimeoutRef = useRef<number | null>(null);
  const wasPlayingRef = useRef<boolean>(false);
  const isSwitchingRef = useRef<boolean>(false);
  const playbackStateRef = useRef<PlaybackState>('idle');
  const armDropRef = useRef<number>(0);
  const armPhaseStartRef = useRef<number>(0);
  const armPhaseFromRef = useRef<number>(0);
  const armTargetRef = useRef<number>(0);
  const armAnimatingRef = useRef<boolean>(false);
  const pendingPlayRef = useRef<boolean>(false);
  const shouldCrackleRef = useRef<boolean>(false);

  const currentTrack = tracks[trackIndex];

  useEffect(() => {
    playbackStateRef.current = playbackState;
  }, [playbackState]);

  useEffect(() => {
    armDropRef.current = armDrop;
  }, [armDrop]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const crackle = new Audio();
    crackle.preload = 'auto';
    crackle.src = CRACKLE_SRC;
    crackle.volume = 0.3;
    crackleRef.current = crackle;

    return () => {
      audio.pause();
      audio.src = '';
      crackle.pause();
      crackle.src = '';
      audioRef.current = null;
      crackleRef.current = null;
    };
  }, []);

  const triggerCrossfade = useCallback((oldArt: string) => {
    setCrossfadeArt(oldArt);
    if (crossfadeTimeoutRef.current) clearTimeout(crossfadeTimeoutRef.current);
    crossfadeTimeoutRef.current = window.setTimeout(() => {
      setCrossfadeArt(null);
    }, 700);
  }, []);

  const playCrackle = useCallback(() => {
    const crackle = crackleRef.current;
    if (!crackle) return;
    crackle.currentTime = 0;
    crackle.play().catch((err) => {
      console.warn('[KLYN] crackle playback failed:', err);
    });
  }, []);

  // Begins playback: if arm is up, drop it first then play on landing.
  // If arm is already down, play immediately (no crackle).
  const beginPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (armDropRef.current >= 0.95) {
      // Arm already on record — play directly, no crackle
      audio.play().catch(() => setPlaybackState('error'));
    } else {
      // Arm is up — start drop animation, defer audio until landing
      pendingPlayRef.current = true;
      shouldCrackleRef.current = true;
      setPlaybackState('dropping');
      armPhaseStartRef.current = performance.now();
      armPhaseFromRef.current = armDropRef.current;
      armTargetRef.current = 1;
      armAnimatingRef.current = true;
    }
  }, []);

  const selectTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const wasPlaying = !audio.paused && !audio.ended;
      const oldArt = tracks[trackIndexRef.current].art;

      if (index === trackIndexRef.current) {
        if (!audio.paused && !audio.ended) {
          audio.pause();
        } else {
          beginPlayback();
        }
        return;
      }

      triggerCrossfade(oldArt);
      setTrackIndex(index);
      trackIndexRef.current = index;
      setProgress(0);

      audio.pause();
      audio.src = tracks[index].src;
      audio.load();
      setDuration(0);
      setPlaybackState('loading');

      if (wasPlaying) {
        isSwitchingRef.current = true;
      }
      wasPlayingRef.current = true;
    },
    [tracks, triggerCrossfade, beginPlayback]
  );

  const next = useCallback(() => {
    const n = (trackIndexRef.current + 1) % tracks.length;
    selectTrack(n);
  }, [tracks.length, selectTrack]);

  const prev = useCallback(() => {
    const p = (trackIndexRef.current - 1 + tracks.length) % tracks.length;
    selectTrack(p);
  }, [tracks.length, selectTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      if (wasPlayingRef.current) {
        wasPlayingRef.current = false;
        beginPlayback();
      } else {
        setPlaybackState('idle');
      }
    };

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const onEnded = () => {
      const oldArt = tracks[trackIndexRef.current].art;
      triggerCrossfade(oldArt);
      const n = (trackIndexRef.current + 1) % tracks.length;
      setTrackIndex(n);
      trackIndexRef.current = n;
      setProgress(0);
      audio.src = tracks[n].src;
      audio.load();
      setPlaybackState('loading');
      wasPlayingRef.current = true;
    };

    const onPlay = () => {
      setPlaybackState('playing');
      phaseStartRef.current = performance.now();
      phaseFromSpeedRef.current = currentSpeedRef.current;
      targetSpeedRef.current = 1;
    };

    const onPause = () => {
      if (audio.ended) return;
      if (isSwitchingRef.current) return;
      setPlaybackState('spinning-down');
      phaseStartRef.current = performance.now();
      phaseFromSpeedRef.current = currentSpeedRef.current;
      targetSpeedRef.current = 0;

      armPhaseStartRef.current = performance.now();
      armPhaseFromRef.current = armDropRef.current;
      armTargetRef.current = 0;
      armAnimatingRef.current = true;
    };

    const onError = () => {
      setPlaybackState('error');
    };

    const onWaiting = () => {
      setPlaybackState('loading');
    };
    const onCanPlay = () => {
      if (!audio.paused) {
        setPlaybackState('playing');
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [tracks, triggerCrossfade, beginPlayback]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;
    audio.src = tracks[0].src;
    audio.load();
    setPlaybackState('idle');
  }, [tracks]);

  const tick = useCallback(() => {
    const now = performance.now();
    if (lastTimeRef.current === null) lastTimeRef.current = now;
    const dt = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Spin speed
    const phaseElapsed = now - phaseStartRef.current;
    let speed = currentSpeedRef.current;

    if (targetSpeedRef.current > currentSpeedRef.current) {
      const t = Math.min(phaseElapsed / ACCEL_DURATION, 1);
      speed = phaseFromSpeedRef.current + (1 - phaseFromSpeedRef.current) * easeOutCubic(t);
      if (t >= 1) {
        speed = 1;
        currentSpeedRef.current = 1;
      }
    } else if (targetSpeedRef.current < currentSpeedRef.current) {
      const t = Math.min(phaseElapsed / DECEL_DURATION, 1);
      speed = phaseFromSpeedRef.current * (1 - easeInCubic(t));
      if (t >= 1) {
        speed = 0;
        currentSpeedRef.current = 0;
        if (playbackStateRef.current === 'spinning-down') {
          setPlaybackState('idle');
        }
        if (isSwitchingRef.current) {
          isSwitchingRef.current = false;
        }
      }
    }

    if (isSwitchingRef.current && currentSpeedRef.current > 0) {
      speed = 1;
      currentSpeedRef.current = 1;
    }

    currentSpeedRef.current = speed;
    setSpinSpeed(speed);

    const delta = SPIN_RATE * dt * speed;
    rotationRef.current += delta;
    setRotation(rotationRef.current);

    // Arm drop / lift animation
    if (armAnimatingRef.current) {
      const armElapsed = now - armPhaseStartRef.current;
      const t = Math.min(armElapsed / ARM_DURATION, 1);
      const eased = easeOutCubic(t);
      const newDrop =
        armPhaseFromRef.current +
        (armTargetRef.current - armPhaseFromRef.current) * eased;
      setArmDrop(newDrop);
      armDropRef.current = newDrop;

      if (t >= 1) {
        armAnimatingRef.current = false;
        setArmDrop(armTargetRef.current);
        armDropRef.current = armTargetRef.current;

        // Arm just landed — if playback is pending, crackle + start audio
        if (armTargetRef.current === 1 && pendingPlayRef.current) {
          pendingPlayRef.current = false;
          if (shouldCrackleRef.current) {
            shouldCrackleRef.current = false;
            playCrackle();
          }
          const audio = audioRef.current;
          if (audio) {
            audio.play().catch(() => setPlaybackState('error'));
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [playCrackle]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (playbackState === 'error') {
      audio.src = tracks[trackIndexRef.current].src;
      audio.load();
    }
    beginPlayback();
  }, [playbackState, tracks, beginPlayback]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused && !audio.ended) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const state: TurntableState = {
    rotation,
    playbackState,
    currentTrack,
    trackIndex,
    progress,
    duration,
    crossfadeArt,
    spinSpeed,
    armDrop,
  };

  return { state, play, pause, togglePlay, next, prev, selectTrack, seek };
}
