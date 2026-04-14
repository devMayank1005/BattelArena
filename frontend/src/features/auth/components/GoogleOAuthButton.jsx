import { getGoogleOAuthUrl } from '../services/auth.api';

export default function GoogleOAuthButton({ label = 'Continue with Google' }) {
	return (
		<a
			href={getGoogleOAuthUrl()}
			className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
		>
			<svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
				<path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12S6.6 21.8 12 21.8c6.9 0 9.6-4.8 9.6-7.2 0-.5 0-.9-.1-1.3H12z" />
			</svg>
			<span>{label}</span>
		</a>
	);
}
