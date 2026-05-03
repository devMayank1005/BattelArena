import UserMessage from '../UserMessage';
import ArenaResponse from '../ArenaResponse';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ChatFeed({
	errorMessage,
	activeSessionBattles,
	registerBattleRef,
	onRetry,
	endOfMessagesRef,
	isSidebarOpen,
}) {
	return (
		<section className={`min-h-[60vh] px-4 md:px-8 py-8 transition-[padding] duration-300 ${isSidebarOpen ? 'lg:pl-[340px]' : 'lg:pl-8'}`}>
			{errorMessage && (
				<div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
					{errorMessage}
				</div>
			)}

			{activeSessionBattles.length === 0 ? (
				<motion.div 
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="h-[calc(100vh-16rem)] flex flex-col items-center justify-center text-zinc-400"
				>
					<div className="text-center px-6 max-w-lg mx-auto">
						<div className="mb-8 flex justify-center">
							<div className="relative">
								<div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-xl" />
								<div className="relative bg-blue-100 dark:bg-blue-900/30 p-5 rounded-3xl border border-blue-200/30 dark:border-blue-800/30">
									<Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />
								</div>
							</div>
						</div>
						<h2 className="text-3xl font-bold mb-4 text-zinc-800 dark:text-zinc-200 tracking-tight">How can I help you code today?</h2>
						<p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">Type a problem below to launch a fresh battle between modern LLMs in this chat thread.</p>
					</div>
				</motion.div>
			) : (
				<AnimatePresence initial={false}>
					{activeSessionBattles.map((battle) => (
						<motion.div
							key={battle.id}
							layout
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							ref={registerBattleRef(battle.id)}
							className="mb-12"
						>
							<UserMessage message={battle.prompt} />
							<ArenaResponse battle={battle} onRetry={() => onRetry(battle)} />
						</motion.div>
					))}
				</AnimatePresence>
			)}
			<div ref={endOfMessagesRef} />
		</section>
	);
}