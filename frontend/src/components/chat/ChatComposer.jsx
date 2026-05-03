import { Send } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ChatComposer({ inputRef, inputValue, onInputChange, onSubmit, isSidebarOpen }) {
  return (
    <div className={cn(
      "shrink-0 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-4 md:px-8 py-4 transition-[padding] duration-300",
      isSidebarOpen ? "lg:pl-[340px]" : "lg:pl-8"
    )}>
      <div className="max-w-4xl mx-auto w-full">
        <form 
          onSubmit={onSubmit} 
          className={cn(
            "relative flex items-center transition-all duration-300",
            "bg-zinc-100/80 dark:bg-zinc-800/80",
            "rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50",
            "shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-blue-400/30 dark:focus-within:border-blue-500/30",
          )}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={onInputChange}
            placeholder="Ask a coding question..."
            className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 border-none rounded-2xl py-4 pl-6 pr-16 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500 text-base transition-all"
          />
          <button
            type="submit"
            className={cn(
              "absolute right-2 p-3 rounded-xl transition-all duration-300 flex items-center justify-center group outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              inputValue.trim() 
                ? "bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-md hover:shadow-blue-500/25" 
                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed"
            )}
            disabled={!inputValue.trim()}
          >
            <Send className={cn("w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5", !inputValue.trim() && "group-hover:translate-x-0 group-hover:translate-y-0")} strokeWidth={2.5} />
          </button>
        </form>
        <div className="mt-2 text-center text-[11px] font-medium text-zinc-400 dark:text-zinc-600">
          AI chat can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
  );
}