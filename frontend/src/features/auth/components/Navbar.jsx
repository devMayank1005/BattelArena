import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CTAButton from './CTAButton';
import ThemeToggle from './ThemeToggle';
import { Swords } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-cyan-400/20 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="w-full flex items-center justify-between px-6 md:px-12 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-cyan-900/40 border-2 border-cyan-400/30 transition-colors group-hover:bg-cyan-900/60 glow-effect">
            <Swords className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-cyan-300 group-hover:text-cyan-200 transition-colors">BattleArena</span>
        </Link>

        <nav className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-zinc-400 sm:inline">{user?.email}</span>
              <Link to="/arena">
                <CTAButton variant="secondary">Arena</CTAButton>
              </Link>
              <CTAButton onClick={onLogout} disabled={isLoading}>Logout</CTAButton>
            </>
          ) : (
            <>
              <Link to="/">
                <button type="button" className="rounded-full px-5 py-2 text-sm font-medium text-cyan-300 hover:text-cyan-200 border-2 border-cyan-400/50 hover:border-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40 backdrop-blur-md transition-all glow-effect">
                  Home
                </button>
              </Link>
              <Link to="/auth/login">
                <button type="button" className="rounded-full px-5 py-2 text-sm font-medium text-zinc-300 hover:text-white border-2 border-zinc-600/50 bg-black/40 backdrop-blur-md transition-all hover:bg-black/60">
                  Login
                </button>
              </Link>
              <Link to="/auth/register">
                <button type="button" className="rounded-full px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 shadow-lg transition-all active:scale-95 glow-effect">
                  Register
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
