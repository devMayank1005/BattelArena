export default function AuthLoader({ label = 'Checking your session...' }) {
	return (
		<div className="min-h-[40vh] flex items-center justify-center">
			<div className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm text-zinc-700 shadow-sm">
				<span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
				<span>{label}</span>
			</div>
		</div>
	);
}
