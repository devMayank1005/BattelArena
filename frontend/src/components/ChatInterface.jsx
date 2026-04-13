import React, { useEffect, useMemo, useRef, useState } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';

const BATTLES_STORAGE_KEY = 'battelarena:battles';
const SESSIONS_STORAGE_KEY = 'battelarena:sessions';

const FEATURE_ITEMS = [
  'Streaming multi-model responses',
  'Side-by-side code diff view',
  'Judge winner explanation',
  'Score breakdown by category',
  'Retry failed battles instantly',
  'Session-based chat history',
];

function loadFromStorage(key) {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeStoredSession(session) {
  if (!session || typeof session !== 'object' || !session.id) {
    return null;
  }

  return {
    id: String(session.id),
    title: session.title || 'New Chat',
    createdAt: session.createdAt || new Date().toISOString(),
    updatedAt: session.updatedAt || new Date().toISOString(),
  };
}

function normalizeStoredBattle(battle) {
  if (!battle || typeof battle !== 'object') {
    return null;
  }

  return {
    id: battle.id ?? Date.now(),
    sessionId: String(battle.sessionId || 'session-legacy'),
    prompt: battle.prompt ?? battle.problem ?? '',
    status: battle.status ?? (battle.judge ? 'complete' : 'streaming'),
    solution1: battle.solution1 ?? battle.solution_1 ?? battle.solutions?.mistral ?? '',
    solution2: battle.solution2 ?? battle.solution_2 ?? battle.solutions?.cohere ?? '',
    judge: battle.judge ?? battle.evaluation ?? null,
    errorMessage: battle.errorMessage ?? '',
    createdAt: battle.createdAt ?? new Date().toISOString(),
    updatedAt: battle.updatedAt ?? new Date().toISOString(),
  };
}

function promptSnippet(prompt) {
  return prompt.length > 72 ? `${prompt.slice(0, 72)}...` : prompt;
}

function createSession(id, title = 'New Chat') {
  const now = new Date().toISOString();
  return {
    id,
    title,
    createdAt: now,
    updatedAt: now,
  };
}

function createBattle(prompt, id, sessionId) {
  const now = new Date().toISOString();

  return {
    id,
    sessionId,
    prompt,
    status: 'streaming',
    solution1: '',
    solution2: '',
    judge: null,
    errorMessage: '',
    createdAt: now,
    updatedAt: now,
  };
}

function buildSessionsFromBattles(battles) {
  const map = new Map();

  for (const battle of battles) {
    const existing = map.get(battle.sessionId);
    const title = existing?.title || promptSnippet(battle.prompt || 'New Chat');

    map.set(battle.sessionId, {
      id: battle.sessionId,
      title,
      createdAt: existing?.createdAt || battle.createdAt,
      updatedAt: battle.updatedAt,
    });
  }

  return Array.from(map.values());
}

function parseSseBlock(block) {
  const event = { type: 'message', data: '' };
  const lines = block.split('\n');

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event.type = line.slice(6).trim();
    }

    if (line.startsWith('data:')) {
      event.data += line.slice(5).trimStart();
    }
  }

  try {
    return {
      type: event.type,
      data: event.data ? JSON.parse(event.data) : null,
    };
  } catch {
    return {
      type: event.type,
      data: event.data,
    };
  }
}

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
  const [battles, setBattles] = useState(() =>
    loadFromStorage(BATTLES_STORAGE_KEY).map(normalizeStoredBattle).filter(Boolean),
  );
  const [sessions, setSessions] = useState(() => {
    const storedSessions = loadFromStorage(SESSIONS_STORAGE_KEY)
      .map(normalizeStoredSession)
      .filter(Boolean);

    if (storedSessions.length > 0) {
      return storedSessions;
    }

    const restoredBattles = loadFromStorage(BATTLES_STORAGE_KEY)
      .map(normalizeStoredBattle)
      .filter(Boolean);

    return buildSessionsFromBattles(restoredBattles);
  });
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const storedSessions = loadFromStorage(SESSIONS_STORAGE_KEY)
      .map(normalizeStoredSession)
      .filter(Boolean)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    if (storedSessions.length > 0) {
      return storedSessions[0].id;
    }

    const restoredBattles = loadFromStorage(BATTLES_STORAGE_KEY)
      .map(normalizeStoredBattle)
      .filter(Boolean)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    if (restoredBattles.length > 0) {
      return restoredBattles[0].sessionId;
    }

    return null;
  });
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );
  const [isDraggingEdge, setIsDraggingEdge] = useState(false);

  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const battleRefs = useRef(new Map());
  const dragStartXRef = useRef(null);
  const dragOpenedRef = useRef(false);

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
  const isInvalidProductionApiBase =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    apiBaseUrl.includes('localhost');

  const activeSessionBattles = useMemo(
    () => battles.filter((battle) => battle.sessionId === activeSessionId),
    [battles, activeSessionId],
  );

  const historySessions = useMemo(
    () => [...sessions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [sessions],
  );

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [battles, activeSessionId]);

  useEffect(() => {
    window.localStorage.setItem(BATTLES_STORAGE_KEY, JSON.stringify(battles));
  }, [battles]);

  useEffect(() => {
    window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (sessions.length === 0) {
      const firstSession = createSession(`session-${Date.now()}`, 'New Chat');
      setSessions([firstSession]);
      setActiveSessionId(firstSession.id);
      return;
    }

    if (!activeSessionId || !sessions.some((session) => session.id === activeSessionId)) {
      setActiveSessionId(historySessions[0]?.id || sessions[0].id);
    }
  }, [sessions, activeSessionId, historySessions]);

  useEffect(() => {
    if (isInvalidProductionApiBase) {
      setErrorMessage('Invalid VITE_API_BASE_URL for production. Set it to your Render URL, not localhost.');
    }
  }, [isInvalidProductionApiBase]);

  const registerBattleRef = (id) => (node) => {
    if (node) {
      battleRefs.current.set(id, node);
    } else {
      battleRefs.current.delete(id);
    }
  };

  const ensureSession = (sessionId, titleHint) => {
    setSessions((currentSessions) => {
      const existing = currentSessions.find((session) => session.id === sessionId);

      if (existing) {
        return currentSessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                title:
                  session.title === 'New Chat' || /^Chat \d+$/.test(session.title)
                    ? titleHint || session.title
                    : session.title,
                updatedAt: new Date().toISOString(),
              }
            : session,
        );
      }

      return [
        {
          ...createSession(sessionId, titleHint || 'New Chat'),
          updatedAt: new Date().toISOString(),
        },
        ...currentSessions,
      ];
    });
  };

  const updateBattle = (id, updater) => {
    setBattles((currentBattles) =>
      currentBattles.map((battle) => {
        if (battle.id !== id) {
          return battle;
        }

        return {
          ...battle,
          ...updater(battle),
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const upsertBattle = (battle) => {
    setBattles((currentBattles) => {
      const exists = currentBattles.some((item) => item.id === battle.id);

      if (exists) {
        return currentBattles.map((item) =>
          item.id === battle.id
            ? {
                ...battle,
                updatedAt: new Date().toISOString(),
              }
            : item,
        );
      }

      return [...currentBattles, battle];
    });
  };

  const setBattleError = (id, message) => {
    updateBattle(id, () => ({
      status: 'error',
      errorMessage: message,
    }));
  };

  const applyStreamEvent = (battleId, event) => {
    if (!event) {
      return;
    }

    if (event.type === 'error') {
      const message = event.data?.message || 'Unable to reach the backend. Make sure the API server is running.';
      setErrorMessage(message);
      setBattleError(battleId, message);
      throw new Error(message);
    }

    if (event.type === 'status') {
      updateBattle(battleId, () => ({
        status: event.data?.phase ?? 'streaming',
      }));
      return;
    }

    if (event.type === 'solution') {
      updateBattle(battleId, (battle) => ({
        status: 'streaming',
        solution1: event.data.model === 'mistral' ? event.data.text : battle.solution1,
        solution2: event.data.model === 'cohere' ? event.data.text : battle.solution2,
      }));
      return;
    }

    if (event.type === 'judge') {
      updateBattle(battleId, () => ({
        status: 'judging',
        judge: event.data.judge,
      }));
      return;
    }

    if (event.type === 'done') {
      const result = event.data.result;
      updateBattle(battleId, () => ({
        status: 'complete',
        prompt: result.input,
        solution1: result.solutions.mistral,
        solution2: result.solutions.cohere,
        judge: result.evaluation,
        errorMessage: '',
      }));
    }
  };

  const streamBattle = async (prompt, battleId) => {
    if (isInvalidProductionApiBase) {
      throw new Error('VITE_API_BASE_URL points to localhost in production');
    }

    const response = await fetch(`${apiBaseUrl}/invoke/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: prompt }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

      let separatorIndex = buffer.indexOf('\n\n');
      while (separatorIndex !== -1) {
        const block = buffer.slice(0, separatorIndex).trim();
        buffer = buffer.slice(separatorIndex + 2);
        if (block) {
          const event = parseSseBlock(block);
          applyStreamEvent(battleId, event);
        }
        separatorIndex = buffer.indexOf('\n\n');
      }

      if (done) {
        break;
      }
    }
  };

  const createAndActivateSession = () => {
    const id = `session-${Date.now()}`;
    const title = `Chat ${sessions.length + 1}`;
    const newSession = createSession(id, title);

    setSessions((current) => [newSession, ...current]);
    setActiveSessionId(id);

    return id;
  };

  const startBattle = async (prompt, battleId = Date.now(), sessionIdArg = null) => {
    const sessionId = sessionIdArg || activeSessionId || createAndActivateSession();
    const freshBattle = createBattle(prompt, battleId, sessionId);

    upsertBattle(freshBattle);
    ensureSession(sessionId, promptSnippet(prompt));
    setActiveSessionId(sessionId);
    setErrorMessage('');

    try {
      await streamBattle(prompt, battleId);
    } catch (error) {
      const message = 'Unable to reach the backend. Make sure the API server is running.';
      console.error('Failed to submit prompt:', error);
      setErrorMessage(message);
      setBattleError(battleId, message);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    const prompt = inputValue.trim();
    setInputValue('');
    await startBattle(prompt);
  };

  const handleRetry = async (battle) => {
    await startBattle(battle.prompt, battle.id, battle.sessionId);
    battleRefs.current.get(battle.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNewChat = () => {
    createAndActivateSession();
    setInputValue('');
    setErrorMessage('');
    inputRef.current?.focus();

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleOpenSession = (sessionId) => {
    setActiveSessionId(sessionId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleEdgeDragStart = (event) => {
    if (isSidebarOpen) {
      return;
    }

    const x = event.touches ? event.touches[0].clientX : event.clientX;
    if (x > 28) {
      return;
    }

    dragStartXRef.current = x;
    dragOpenedRef.current = false;
    setIsDraggingEdge(true);
  };

  const handleEdgeDragMove = (event) => {
    if (dragStartXRef.current === null) {
      return;
    }

    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const delta = x - dragStartXRef.current;

    if (delta > 70 && !dragOpenedRef.current) {
      dragOpenedRef.current = true;
      setIsSidebarOpen(true);
      setIsDraggingEdge(false);
      dragStartXRef.current = null;
    }
  };

  const handleEdgeDragEnd = () => {
    dragStartXRef.current = null;
    dragOpenedRef.current = false;
    setIsDraggingEdge(false);
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
                  onClick={() => handleOpenSession(session.id)}
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
            onClick={() => setIsSidebarOpen((prev) => !prev)}
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
