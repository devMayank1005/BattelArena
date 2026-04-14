const STEPS = [
	{
		title: 'Sign in with your account',
		description: 'Create an account or log in to keep your battles synced across refreshes.',
	},
	{
		title: 'Launch a prompt battle',
		description: 'Write one problem statement and compare two model responses side by side.',
	},
	{
		title: 'Review the judge score',
		description: 'Use score breakdowns to understand which answer is stronger and why.',
	},
];

export default function FeatureSteps() {
	return (
		<section className="mx-auto mt-14 max-w-5xl px-4">
			<h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">How Battle Arena works</h2>
			<div className="mt-6 grid gap-4 md:grid-cols-3">
				{STEPS.map((step, index) => (
					<article key={step.title} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
						<p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Step {index + 1}</p>
						<h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
						<p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{step.description}</p>
					</article>
				))}
			</div>
		</section>
	);
}
