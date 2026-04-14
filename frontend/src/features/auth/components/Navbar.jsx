import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CTAButton from './CTAButton';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
	const navigate = useNavigate();
	const { isAuthenticated, user, logout, isLoading } = useAuth();

	const onLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<header className="border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/90">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
				<Link to="/" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
					BattleArena
				</Link>

				<nav className="flex items-center gap-3">
					<ThemeToggle />
					{isAuthenticated ? (
						<>
							<span className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:inline">{user?.email}</span>
							<Link to="/arena">
								<CTAButton variant="secondary">Arena</CTAButton>
							</Link>
							<CTAButton onClick={onLogout} disabled={isLoading}>Logout</CTAButton>
						</>
					) : (
						<>
							<Link to="/auth/login">
								<CTAButton variant="secondary">Login</CTAButton>
							</Link>
							<Link to="/auth/register">
								<CTAButton>Register</CTAButton>
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
