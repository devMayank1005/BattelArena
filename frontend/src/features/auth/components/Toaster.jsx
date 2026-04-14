import { useEffect } from 'react';

export default function Toaster({ message, onClose, variant = 'error' }) {
	useEffect(() => {
		if (!message || !onClose) {
			return undefined;
		}

		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [message, onClose]);

	if (!message) {
		return null;
	}

	const colorClassName =
		variant === 'success'
			? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
			: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900 dark:text-red-200';

	return (
		<div className="fixed right-4 top-4 z-50">
			<div className={`rounded-xl border px-4 py-3 text-sm shadow ${colorClassName}`}>
				{message}
			</div>
		</div>
	);
}
