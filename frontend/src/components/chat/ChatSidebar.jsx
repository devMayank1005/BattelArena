import { memo, useMemo } from 'react';
import { selectSessionSummaryById } from '../../features/ai/context/arena-selectors';
import { X, Plus, CheckCircle2, MessageSquare, History } from 'lucide-react';

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
					className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
				>
					<X size={20} />
				</button>
			</div>

			<div className="mb-5">
				<button
					type="button"
					onClick={onNewChat}
					className="w-full rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-medium text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95"
				>
					<Plus size={18} />
					<span>New Chat</span>
				</button>
			</div>

			<section>
				<h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
					<CheckCircle2 size={14} /> Features
				</h2>
				<ul className="mt-4 space-y-2 relative">
					{FEATURE_ITEMS.map((feature) => (
						<li
							key={feature}
							className="rounded-[1rem] bg-zinc-50 dark:bg-zinc-950/50 px-3 py-2.5 text-[13px] text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2"
						>
							<div className="w-1 h-1 rounded-full bg-blue-400" />
							{feature}
						</li>
					))}
				</ul>
			</section>

			<section className="mt-8">
				<div className="mb-4 flex items-center justify-between gap-3">
					<h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
						<History size={14} /> Chat History
					</h3>
					<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{historySessions.length}</span>
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
									className={`w-full rounded-2xl border px-4 py-3 text-left transition-all hover:border-zinc-300 dark:hover:border-zinc-600 group ${
										isActive
											? 'border-blue-500 bg-blue-50 dark:border-blue-500/60 dark:bg-blue-950/40 shadow-sm'
											: 'border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50'
									}`}
								>
									<div className="mb-1 flex items-center justify-between gap-2">
										<span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-500'}`}>
											{lastBattle ? statusBadge(lastBattle.status) : 'Empty'}
										</span>
										<span className="text-[10px] text-zinc-400 dark:text-zinc-500">
											{new Date(session.updatedAt).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>
									<div className="flex items-start gap-2 mt-2">
										<MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 transition-colors ${isActive ? 'text-blue-500' : 'text-zinc-400 group-hover:text-zinc-500'}`} />
										<div>
											<p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">{session.title}</p>
											<p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
												{summary.count} prompt{summary.count !== 1 ? 's' : ''}
											</p>
										</div>
									</div>
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