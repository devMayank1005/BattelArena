import { Link } from 'react-router-dom';
import CTAButton from './CTAButton';

export default function HeroSection({ isAuthenticated = false }) {
	return (
		<section className="mx-auto max-w-5xl px-4 pt-12 pb-6">
			<div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm md:p-12">
				<p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Code Battle Platform</p>
				<h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
					Pit AI models against each other for your coding prompts
				</h1>
				<p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
					Compare solutions, inspect diffs, and review judge verdicts in one flow designed for iterative prompt testing.
				</p>
				<div className="mt-8 flex flex-wrap items-center gap-3">
					{isAuthenticated ? (
						<Link to="/arena">
							<CTAButton>Open Arena</CTAButton>
						</Link>
					) : (
						<>
							<Link to="/register">
								<CTAButton>Create Account</CTAButton>
							</Link>
							<Link to="/login">
								<CTAButton variant="secondary">Sign In</CTAButton>
							</Link>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
