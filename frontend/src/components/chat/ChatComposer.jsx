export default function ChatComposer({ inputRef, inputValue, onInputChange, onSubmit }) {
	return (
		<div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
			<div className="max-w-4xl mx-auto">
				<form onSubmit={onSubmit} className="relative flex items-center">
					<input
						ref={inputRef}
						type="text"
						value={inputValue}
						onChange={onInputChange}
						placeholder="Ask a coding question..."
						className="w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-none rounded-full py-4 pl-6 pr-16 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-zinc-400 transition-shadow shadow-sm hover:shadow-md text-lg"
					/>
					<button
						type="submit"
						className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={!inputValue.trim()}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
							<path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
						</svg>
					</button>
				</form>
			</div>
		</div>
	);
}