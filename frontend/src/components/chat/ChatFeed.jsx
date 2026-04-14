import UserMessage from '../UserMessage';
import ArenaResponse from '../ArenaResponse';

export default function ChatFeed({
	errorMessage,
	activeSessionBattles,
	registerBattleRef,
	onRetry,
	endOfMessagesRef,
	isSidebarOpen,
}) {
	return (
		<section className={`min-h-[60vh] transition-[padding] duration-300 ${isSidebarOpen ? 'lg:pl-[320px]' : 'lg:pl-0'}`}>
			{errorMessage && (
				<div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
					{errorMessage}
				</div>
			)}

			{activeSessionBattles.length === 0 ? (
				<div className="h-full flex items-center justify-center text-zinc-400 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700">
					<div className="text-center px-6">
						<h2 className="text-2xl font-light mb-2 text-zinc-600 dark:text-zinc-300">Start a new chat</h2>
						<p>Type a problem below to launch a fresh battle in this chat thread.</p>
					</div>
				</div>
			) : (
				activeSessionBattles.map((battle) => (
					<div
						key={battle.id}
						ref={registerBattleRef(battle.id)}
						className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
					>
						<UserMessage message={battle.prompt} />
						<ArenaResponse battle={battle} onRetry={() => onRetry(battle)} />
					</div>
				))
			)}
			<div ref={endOfMessagesRef} />
		</section>
	);
}