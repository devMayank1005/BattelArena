import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import CTAButton from './CTAButton';
import VaporTrailBackground from '../../../components/VaporTrailBackground';
import AnimatedBorder from '../../../components/AnimatedBorder';
import AnimatedLogo from '../../../components/AnimatedLogo';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ isAuthenticated = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-badge', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }
      )
      .fromTo('.hero-title', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        '-=0.6'
      )
      .fromTo('.hero-text', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        '-=0.6'
      )
      .fromTo('.hero-actions a', 
        { y: 20, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 }, 
        '-=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative mx-auto max-w-6xl px-4 pt-20 pb-12 overflow-hidden">
      <VaporTrailBackground />
      
      {/* Animated revolving rainbow border */}
      <AnimatedBorder />
      
      {/* Floating accent elements - removed for cleaner look */}
      
      <div className="relative rounded-[3rem] bg-black/80 backdrop-blur-3xl md:p-16 p-8 text-center z-10" style={{ boxShadow: '0 0 60px rgba(0, 240, 255, 0.2)' }}>
        <div className="hero-badge inline-flex items-center gap-2 rounded-full border-2 border-cyan-400/50 bg-cyan-900/20 px-4 py-2 mb-6 backdrop-blur-md glow-effect">
          <AnimatedLogo />
          <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Code Battle Platform</span>
        </div>
        
        <h1 className="hero-title mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white md:text-7xl leading-[1.1] mb-6">
          Pit AI models against each other 
          <span className="block text-rgb-gradient mt-2">for your coding prompts</span>
        </h1>
        
        <p className="hero-text mx-auto mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-zinc-300 mb-10">
          Compare solutions, inspect diffs, and review judge verdicts in one seamless flow designed for iterative prompt testing.
        </p>
        
        <div className="hero-actions flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/arena">
              <button className="relative px-8 py-4 rounded-full font-medium bg-gradient-to-r from-blue-400 to-purple-500 text-white border-2 border-cyan-400/50 shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 group overflow-hidden glow-effect"
                style={{ boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)' }}
                onMouseDown={(e) => {
                  const btn = e.currentTarget;
                  gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                  });
                }}
                onMouseUp={(e) => {
                  const btn = e.currentTarget;
                  gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.2,
                  });
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity rounded-full" />
                <span className="relative flex items-center gap-2">
                  Start Battle
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </Link>
          ) : (
            <>
              <Link to="/auth/login">
                <button className="relative px-8 py-4 rounded-full font-medium bg-gradient-to-r from-blue-400 to-purple-500 text-white border-2 border-cyan-400/50 shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 group overflow-hidden glow-effect"
                  style={{ boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)' }}
                  onMouseDown={(e) => {
                    const btn = e.currentTarget;
                    gsap.to(btn, {
                      scale: 0.95,
                      duration: 0.1,
                    });
                  }}
                  onMouseUp={(e) => {
                    const btn = e.currentTarget;
                    gsap.to(btn, {
                      scale: 1.05,
                      duration: 0.2,
                    });
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity rounded-full" />
                  <span className="relative flex items-center gap-2">
                    Start Battle
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
              <Link to="/register">
                <button type="button" className="rounded-full px-8 py-4 text-base font-medium border-2 border-cyan-400/50 bg-black/60 hover:bg-black/40 text-cyan-300 hover:text-cyan-200 transition-all hover:scale-105 active:scale-95 backdrop-blur-md glow-effect font-semibold"
                  onMouseDown={(e) => {
                    const btn = e.currentTarget;
                    gsap.to(btn, {
                      scale: 0.95,
                      duration: 0.1,
                    });
                  }}
                  onMouseUp={(e) => {
                    const btn = e.currentTarget;
                    gsap.to(btn, {
                      scale: 1.05,
                      duration: 0.2,
                    });
                  }}
                >
                  Create Account
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
