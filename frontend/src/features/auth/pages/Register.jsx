import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import CTAButton from '../components/CTAButton';
import GoogleOAuthButton from '../components/GoogleOAuthButton';
import Navbar from '../components/Navbar';
import Toaster from '../components/Toaster';
import useAuth from '../hooks/useAuth';

export default function Register() {
	const { register, isLoading, isAuthenticated, authError, clearError } = useAuth();
	const [form, setForm] = useState({ email: '', password: '' });

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
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
			<Navbar />

			<main className="mx-auto max-w-md px-4 py-14">
				<div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
					<h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Create account</h1>
					<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Start comparing model answers in your arena.</p>

					<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
						<label className="block">
							<span className="text-sm text-zinc-700 dark:text-zinc-300">Email</span>
							<input
								name="email"
								type="email"
								required
								value={form.email}
								onChange={handleChange}
								className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
							/>
						</label>

						<label className="block">
							<span className="text-sm text-zinc-700 dark:text-zinc-300">Password</span>
							<input
								name="password"
								type="password"
								required
								minLength={6}
								value={form.password}
								onChange={handleChange}
								className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
							/>
						</label>

						<CTAButton type="submit" disabled={isLoading} className="w-full">
							{isLoading ? 'Creating account...' : 'Create account'}
						</CTAButton>
					</form>

					<div className="my-4 flex items-center gap-3">
						<div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
						<span className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-600">or</span>
						<div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
					</div>

					<GoogleOAuthButton label="Continue with Google" />

					<p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
						Already have an account?{' '}
						<Link className="font-medium text-blue-600 hover:underline dark:text-blue-400" to="/login">
							Sign in
						</Link>
					</p>
				</div>
			</main>

			<Toaster message={authError} onClose={clearError} />
		</div>
	);
}
