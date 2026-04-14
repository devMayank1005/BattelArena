import { Suspense, lazy, useEffect, useRef } from 'react';
import userArena from '../features/ai/hooks/userArena';

const ChatTopBar = lazy(() => import('./chat/ChatTopBar'));
const ChatSidebar = lazy(() => import('./chat/ChatSidebar'));
const ChatFeed = lazy(() => import('./chat/ChatFeed'));
const ChatComposer = lazy(() => import('./chat/ChatComposer'));

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

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Suspense fallback={<div className="h-16 border-b border-zinc-200 bg-white/80" />}>
        <ChatTopBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          onNewChat={handleNewChat}
        />
      </Suspense>

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

          <Suspense
            fallback={(
              <section className={`min-h-[60vh] transition-[padding] duration-300 ${isSidebarOpen ? 'lg:pl-[320px]' : 'lg:pl-0'}`}>
                <div className="h-full min-h-[60vh] flex items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/70 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
                  Loading chat...
                </div>
              </section>
            )}
          >
            <ChatSidebar
              battles={battles}
              historySessions={historySessions}
              activeSessionId={activeSessionId}
              isSidebarOpen={isSidebarOpen}
              onNewChat={handleNewChat}
              onOpenSession={openSession}
              onCloseSidebar={() => setIsSidebarOpen(false)}
            />

            <ChatFeed
              errorMessage={errorMessage}
              activeSessionBattles={activeSessionBattles}
              registerBattleRef={registerBattleRef}
              onRetry={handleRetry}
              endOfMessagesRef={endOfMessagesRef}
              isSidebarOpen={isSidebarOpen}
            />
          </Suspense>
        </div>
      </main>

      <Suspense fallback={<div className="h-24 border-t border-zinc-200 bg-white" />}>
        <ChatComposer
          inputRef={inputRef}
          inputValue={inputValue}
          onInputChange={(event) => setInputValue(event.target.value)}
          onSubmit={handleSend}
        />
      </Suspense>
    </div>
  );
}
