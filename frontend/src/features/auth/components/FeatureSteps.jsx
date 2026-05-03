import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LogIn, Rocket, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    title: 'Sign in with your account',
    description: 'Create an account or log in to keep your battles synced across refreshes.',
    icon: LogIn,
    accent: '#00f0ff',       // cyan
    accentRgb: '0, 240, 255',
  },
  {
    title: 'Launch a prompt battle',
    description: 'Write one problem statement and compare two model responses side by side.',
    icon: Rocket,
    accent: '#a855f7',       // purple
    accentRgb: '168, 85, 247',
  },
  {
    title: 'Review the judge score',
    description: 'Use score breakdowns to understand which answer is stronger and why.',
    icon: ShieldCheck,
    accent: '#f43f5e',       // rose
    accentRgb: '244, 63, 94',
  },
];

export default function FeatureSteps() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate cards in with a stagger — no ScrollTrigger needed, just a delay
      gsap.fromTo('.feature-card',
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.18,
          ease: 'power3.out',
          delay: 0.8,
        }
      );

      // Subtle floating glow animation
      gsap.to('.feature-glow', {
        scale: 1.15,
        opacity: 0.6,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.6,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="mx-auto mt-24 mb-32 max-w-6xl px-4">
      {/* Section heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl"
          style={{
            background: 'linear-gradient(135deg, #00f0ff, #a855f7, #f43f5e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          How Battle Arena works
        </h2>
        <p className="mt-4 text-zinc-400 text-lg">Three simple steps to iterative code perfection.</p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              className="feature-card group relative rounded-2xl p-[1px] transition-all duration-500 hover:-translate-y-2"
              style={{
                background: `linear-gradient(135deg, rgba(${step.accentRgb}, 0.4), rgba(${step.accentRgb}, 0.1), transparent)`,
              }}
            >
              {/* Background glow */}
              <div
                className="feature-glow absolute -inset-4 rounded-3xl opacity-40 blur-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, rgba(${step.accentRgb}, 0.3) 0%, transparent 70%)`,
                }}
              />

              {/* Card inner */}
              <div
                className="relative rounded-2xl p-8 h-full backdrop-blur-xl overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, rgba(${step.accentRgb}, 0.08) 0%, rgba(15, 15, 25, 0.95) 40%, rgba(10, 10, 20, 0.98) 100%)`,
                  border: `1px solid rgba(${step.accentRgb}, 0.15)`,
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(${step.accentRgb}, 0.8), transparent)`,
                  }}
                />

                {/* Icon badge */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, rgba(${step.accentRgb}, 0.2), rgba(${step.accentRgb}, 0.05))`,
                    border: `1px solid rgba(${step.accentRgb}, 0.3)`,
                    boxShadow: `0 0 20px rgba(${step.accentRgb}, 0.15)`,
                  }}
                >
                  <Icon
                    className="h-7 w-7 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]"
                    style={{ color: step.accent }}
                  />
                </div>

                {/* Step number */}
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: `rgba(${step.accentRgb}, 0.6)` }}
                >
                  Step 0{index + 1}
                </p>

                {/* Title */}
                <h3 className="text-xl font-semibold text-zinc-100 mb-4">{step.title}</h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-zinc-400">{step.description}</p>

                {/* Corner decoration */}
                <div
                  className="absolute bottom-0 right-0 w-24 h-24 opacity-10 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at bottom right, rgba(${step.accentRgb}, 0.8) 0%, transparent 70%)`,
                  }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
