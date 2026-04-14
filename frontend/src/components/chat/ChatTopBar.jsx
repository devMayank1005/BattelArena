export default function ChatTopBar({ isSidebarOpen, onToggleSidebar, onNewChat }) {
	return (
		<header className="py-4 px-4 md:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onToggleSidebar}
					className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-200"
				>
					{isSidebarOpen ? 'Close menu' : 'Open menu'}
				</button>
				<button
					type="button"
					onClick={onNewChat}
					className="hidden sm:inline-flex items-center rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
				>
					New chat
				</button>
			</div>
			<h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">AI Chat Arena</h1>
			<div className="w-[156px]" />
		</header>
	);
}