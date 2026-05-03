import { useState, useRef, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import CTAButton from '../components/CTAButton';
import GoogleOAuthButton from '../components/GoogleOAuthButton';
import Navbar from '../components/Navbar';
import Toaster from '../components/Toaster';
import VaporTrailBackground from '../../../components/VaporTrailBackground';
import AmbientLighting from '../../../components/AmbientLighting';
import AnimatedBorder from '../../../components/AnimatedBorder';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const { register, isLoading, isAuthenticated, authError, clearError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.auth-card', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo('.auth-element', 
        { y: 15, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/arena" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
    } catch {
      // Error is surfaced via auth context.
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden" ref={containerRef}>
      <VaporTrailBackground />
      <AmbientLighting />
      <div className="relative z-10">
        <Navbar />

        <main className="relative mx-auto max-w-md px-4 py-20">
          <div className="auth-card rounded-[2.5rem] border-2 border-cyan-400/40 bg-black/80 p-8 shadow-xl backdrop-blur-3xl sm:p-10 glow-effect" style={{ boxShadow: '0 0 40px rgba(0, 240, 255, 0.3), inset 0 0 40px rgba(0, 240, 255, 0.05)' }}>
            <div className="relative z-10">
              <div className="auth-element text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-cyan-300">Create account</h1>
                <p className="mt-2 text-sm text-zinc-400">Start comparing model answers in your arena.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="auth-element">
                  <label className="block text-sm font-medium text-cyan-300 mb-2 mt-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-[1.2rem] border-2 border-cyan-400/30 bg-black/50 px-4 py-3.5 text-sm outline-none transition-all focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 text-cyan-300 placeholder:text-zinc-600"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="auth-element">
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-[1.2rem] border-2 border-cyan-400/30 bg-black/50 px-4 py-3.5 text-sm outline-none transition-all focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 text-cyan-300 placeholder:text-zinc-600"
                    placeholder="Create a strong password"
                  />
                </div>

                <div className="auth-element pt-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 active:scale-95 transition-all text-white font-medium py-3.5 shadow-lg flex items-center justify-center disabled:opacity-70 disabled:active:scale-100 glow-effect"
                    onMouseDown={(e) => {
                      gsap.to(e.currentTarget, {
                        scale: 0.95,
                        duration: 0.1,
                      });
                    }}
                    onMouseUp={(e) => {
                      gsap.to(e.currentTarget, {
                        scale: 1,
                        duration: 0.2,
                      });
                    }}
                  >
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </button>
                </div>
              </form>

              <div className="auth-element my-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400/60">or</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              </div>

              <div className="auth-element">
                <GoogleOAuthButton label="Continue with Google" />
              </div>

              <p className="auth-element mt-8 text-center text-sm text-zinc-400">
                Already have an account?{' '}
                <Link className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors" to="/login">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>

      <Toaster message={authError} onClose={clearError} />
    </div>
  );
}
