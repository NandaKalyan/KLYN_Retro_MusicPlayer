import { Disc3, Gauge, AudioLines, ArrowRightLeft } from 'lucide-react';

const features = [
  {
    icon: Disc3,
    title: 'Honest Spin',
    desc: 'The record accelerates from a standstill and coasts to a stop with momentum-based easing — no fake looping animation, just real physics.',
  },
  {
    icon: Gauge,
    title: 'Tactile Tonearm',
    desc: 'A pivoting tonearm drops onto the groove as the disc spins up and lifts away as it slows — a needle drop you can feel.',
  },
  {
    icon: ArrowRightLeft,
    title: 'Seamless Crossfade',
    desc: 'Switch tracks and the album art crossfades on the same spinning disc. No jump-cuts, no stutter, just the label melting into the next.',
  },
  {
    icon: AudioLines,
    title: 'Analog Warmth',
    desc: 'Vinyl grooves, subtle grain, and warm amber accents bring the ritual of a record player into a clean, modern interface.',
  },
];

export default function FeatureSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-accent mb-3">
          The Details
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-balance">
          Built like the thing it's inspired by
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {features.map((f) => (
          <div key={f.title} className="flex gap-4">
            <div className="flex-shrink-0">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(224,168,90,0.12), rgba(224,168,90,0.03))',
                  border: '1px solid rgba(224,168,90,0.15)',
                }}
              >
                <f.icon size={20} className="text-amber-accent" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium text-ink-700 mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-ink-600 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
