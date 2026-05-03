import { Menu, Plus, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ChatTopBar({ isSidebarOpen, onToggleSidebar, onNewChat }) {
  return (
    <header className={cn(
      "py-4 px-6 md:px-10 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between transition-[padding] duration-300", 
      isSidebarOpen ? 'lg:pl-[350px]' : 'lg:pl-10'
    )}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center p-2.5 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300 transition-colors"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center gap-2.5 group cursor-default">
          <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center transition-colors group-hover:bg-blue-600/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-blue-400"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" y1="14" x2="9" y2="18"/><line x1="7" y1="17" x2="4" y2="20"/><line x1="3" y1="19" x2="5" y2="21"/></svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            BattleArena
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onNewChat}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/20"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="hidden sm:inline">New Battle</span>
        </button>
      </div>
    </header>
  );
}