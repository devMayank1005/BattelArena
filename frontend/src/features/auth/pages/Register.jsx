import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CTAButton from '../components/CTAButton';
import Navbar from '../components/Navbar';
import Toaster from '../components/Toaster';
import useAuth from '../hooks/useAuth';

export default function Register() {
	const navigate = useNavigate();
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
			navigate('/arena', { replace: true });
		} catch {
			// Error is surfaced via auth context.
		}
	};

	return (
		<div className="min-h-screen bg-zinc-50">
			<Navbar />

			<main className="mx-auto max-w-md px-4 py-14">
				<div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
					<h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Create account</h1>
					<p className="mt-1 text-sm text-zinc-600">Start comparing model answers in your arena.</p>

					<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
						<label className="block">
							<span className="text-sm text-zinc-700">Email</span>
							<input
								name="email"
								type="email"
								required
								value={form.email}
								onChange={handleChange}
								className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
							/>
						</label>

						<label className="block">
							<span className="text-sm text-zinc-700">Password</span>
							<input
								name="password"
								type="password"
								required
								minLength={6}
								value={form.password}
								onChange={handleChange}
								className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
							/>
						</label>

						<CTAButton type="submit" disabled={isLoading} className="w-full">
							{isLoading ? 'Creating account...' : 'Create account'}
						</CTAButton>
					</form>

					<p className="mt-4 text-sm text-zinc-600">
						Already have an account?{' '}
						<Link className="font-medium text-blue-700 hover:underline" to="/login">
							Sign in
						</Link>
					</p>
				</div>
			</main>

			<Toaster message={authError} onClose={clearError} />
		</div>
	);
}
