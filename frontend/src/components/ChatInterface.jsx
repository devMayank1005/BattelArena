import { useEffect, useRef } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import userArena from '../features/ai/hooks/userArena';

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

export default function ChatInterface() {
  const {
    battles,
    activeSessionId,
    inputValue,
    errorMessage,
    isSidebarOpen,
    isDraggingEdge,
    activeSessionBattles,
    historySessions,
    setInputValue,
    setIsSidebarOpen,
    toggleSidebar,
    sendCurrentPrompt,
    retryBattle,
    newChat,
    openSession,
    handleEdgeDragStart,
    handleEdgeDragMove,
    handleEdgeDragEnd,
  } = userArena();

  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const battleRefs = useRef(new Map());

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [battles, activeSessionId]);

  const registerBattleRef = (id) => (node) => {
    if (node) {
      battleRefs.current.set(id, node);
    } else {
      battleRefs.current.delete(id);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    await sendCurrentPrompt();
  };

  const handleRetry = async (battle) => {
    await retryBattle(battle);
    battleRefs.current.get(battle.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNewChat = () => {
    newChat();
    inputRef.current?.focus();
  };

  const sidebarContent = (
    <>
      <div className="mb-5">
        <button
          type="button"
          onClick={handleNewChat}
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
              const sessionBattles = battles.filter((battle) => battle.sessionId === session.id);
              const lastBattle = sessionBattles[sessionBattles.length - 1];
              const isActive = session.id === activeSessionId;

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => openSession(session.id)}
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
                    {sessionBattles.length} prompts
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="py-4 px-4 md:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-200"
          >
            {isSidebarOpen ? 'Close menu' : 'Open menu'}
          </button>
          <button
            type="button"
            onClick={handleNewChat}
            className="hidden sm:inline-flex items-center rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            New chat
          </button>
        </div>
        <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">AI Chat Arena</h1>
        <div className="w-[156px]" />
      </header>

      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 w-full max-w-7xl mx-auto">
        <div className="relative h-full">
          {!isSidebarOpen && (
            <div
              className={`fixed left-0 top-0 bottom-0 w-6 z-10 lg:hidden ${isDraggingEdge ? 'bg-blue-500/10' : ''}`}
              onTouchStart={handleEdgeDragStart}
              onTouchMove={handleEdgeDragMove}
              onTouchEnd={handleEdgeDragEnd}
              onMouseDown={handleEdgeDragStart}
              onMouseMove={handleEdgeDragMove}
              onMouseUp={handleEdgeDragEnd}
              onMouseLeave={handleEdgeDragEnd}
            />
          )}

          {isSidebarOpen && (
            <button
              type="button"
              className="fixed inset-0 bg-black/30 z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
          )}

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
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-400"
              >
                Close
              </button>
            </div>
            {sidebarContent}
          </aside>

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
                  <ArenaResponse battle={battle} onRetry={() => handleRetry(battle)} />
                </div>
              ))
            )}
            <div ref={endOfMessagesRef} />
          </section>
        </div>
      </main>

      <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
    </div>
  );
}
