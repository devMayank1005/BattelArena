export default function CTAButton({
	children,
	type = 'button',
	onClick,
	disabled = false,
	variant = 'primary',
	className = '',
}) {
	const baseClassName =
		'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

	const variantClassName =
		variant === 'secondary'
			? 'border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
			: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800';

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseClassName} ${variantClassName} ${className}`.trim()}
		>
			{children}
		</button>
	);
}
