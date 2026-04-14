import { memo, useMemo } from 'react';
import { selectSessionSummaryById } from '../../features/ai/context/arena-selectors';

const FEATURE_ITEMS = [
	'Streaming multi-model responses',
	'Side-by-side code diff view',
	'Judge winner explanation',
	'Score breakdown by category',
	'Retry failed battles instantly',
	'Session-based chat history',
];

function statusBadge(status) {
	if (status === 'streaming') {
		return 'Streaming';
	}

	if (status === 'judging') {
		return 'Judging';
	}

	if (status === 'complete') {
		return 'Complete';
	}

	return 'Failed';
}

function ChatSidebar({
	battles,
	historySessions,
	activeSessionId,
	isSidebarOpen,
	onNewChat,
	onOpenSession,
	onCloseSidebar,
}) {
	const sessionSummaryById = useMemo(
		() => selectSessionSummaryById(battles, historySessions),
		[battles, historySessions],
	);

	return (
		<aside
			className={`
				fixed left-4 top-[5.8rem] bottom-6 z-30
				w-[300px] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm overflow-y-auto
				transform transition-transform duration-300 ease-out
				${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
			`}
		>
			<div className="mb-4 flex justify-end">
				<button
					type="button"
					onClick={onCloseSidebar}
					className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-400"
				>
					Close
				</button>
			</div>

			<div className="mb-5">
				<button
					type="button"
					onClick={onNewChat}
					className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition-colors"
				>
					+ New Chat
				</button>
			</div>

			<section>
				<h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Features</h2>
				<ul className="mt-4 space-y-2">
					{FEATURE_ITEMS.map((feature) => (
						<li
							key={feature}
							className="rounded-xl bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
						>
							{feature}
						</li>
					))}
				</ul>
			</section>

			<section className="mt-8">
				<div className="mb-3 flex items-center justify-between gap-3">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
						Chat History
					</h3>
					<span className="text-xs text-zinc-400 dark:text-zinc-500">{historySessions.length} chats</span>
				</div>
				{historySessions.length === 0 ? (
					<p className="text-sm text-zinc-500 dark:text-zinc-400">No chats yet. Start a new chat.</p>
				) : (
					<div className="space-y-2">
						{historySessions.map((session) => {
							const summary = sessionSummaryById.get(session.id) || { count: 0, lastBattle: null };
							const lastBattle = summary.lastBattle;
							const isActive = session.id === activeSessionId;

							return (
								<button
									key={session.id}
									type="button"
									onClick={() => onOpenSession(session.id)}
									className={`w-full rounded-2xl border px-3 py-3 text-left transition-all hover:-translate-y-0.5 ${
										isActive
											? 'border-blue-500 bg-blue-50 dark:border-blue-500/60 dark:bg-blue-950/40'
											: 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950'
									}`}
								>
									<div className="mb-1 flex items-center justify-between gap-2">
										<span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
											{lastBattle ? statusBadge(lastBattle.status) : 'Empty'}
										</span>
										<span className="text-[11px] text-zinc-400 dark:text-zinc-500">
											{new Date(session.updatedAt).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>
									<p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{session.title}</p>
									<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
										{summary.count} prompts
									</p>
								</button>
							);
						})}
					</div>
				)}
			</section>
		</aside>
	);
}

export default memo(ChatSidebar);