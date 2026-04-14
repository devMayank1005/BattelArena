import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CTAButton from './CTAButton';

export default function Navbar() {
	const navigate = useNavigate();
	const { isAuthenticated, user, logout, isLoading } = useAuth();

	const onLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
				<Link to="/" className="text-lg font-bold tracking-tight text-zinc-900">
					BattleArena
				</Link>

				<nav className="flex items-center gap-3">
					{isAuthenticated ? (
						<>
							<span className="hidden text-sm text-zinc-600 sm:inline">{user?.email}</span>
							<Link to="/arena">
								<CTAButton variant="secondary">Arena</CTAButton>
							</Link>
							<CTAButton onClick={onLogout} disabled={isLoading}>Logout</CTAButton>
						</>
					) : (
						<>
							<Link to="/login">
								<CTAButton variant="secondary">Login</CTAButton>
							</Link>
							<Link to="/register">
								<CTAButton>Register</CTAButton>
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
