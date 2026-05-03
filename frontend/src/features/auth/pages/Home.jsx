import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSteps from '../components/FeatureSteps';
import Toaster from '../components/Toaster';
import VaporTrailBackground from '../../../components/VaporTrailBackground';
import AmbientLighting from '../../../components/AmbientLighting';
import useAuth from '../hooks/useAuth';
import { Swords } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, authError, clearError } = useAuth();
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-content', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.5 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <VaporTrailBackground />
      <AmbientLighting />
      <div className="relative z-10">
        <Navbar />
        <HeroSection isAuthenticated={isAuthenticated} />
        <FeatureSteps />

        {/* Footer */}
        <footer className="footer-content mt-auto border-t border-cyan-400/20 bg-black/80 backdrop-blur-sm py-16 px-4">
          <div className="mx-auto max-w-6xl text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-cyan-900/40 border-2 border-cyan-400/30 glow-effect">
                <Swords className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-lg font-bold text-cyan-300 tracking-tight">BattleArena</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Pit leading AI models head-to-head. Compare code solutions, inspect diffs, and let a judge pick the winner.
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-500">
              <span>Built with React + Vite</span>
              <span className="w-1 h-1 rounded-full bg-cyan-400/30" />
              <span>Powered by Mistral & Cohere</span>
            </div>
          </div>
        </footer>
      </div>

      <Toaster message={authError} onClose={clearError} />
    </div>
  );
}
