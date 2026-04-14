import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { BATTLE_STORAGE_KEY, SESSION_STORAGE_KEY, createBattleStream } from '../services/battle.api';

export const ArenaContext = createContext(null);

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

export function ArenaProvider({ children }) {
	const [battles, setBattles] = useState(() =>
		loadFromStorage(BATTLE_STORAGE_KEY).map(normalizeStoredBattle).filter(Boolean),
	);
	const [sessions, setSessions] = useState(() => {
		const storedSessions = loadFromStorage(SESSION_STORAGE_KEY)
			.map(normalizeStoredSession)
			.filter(Boolean);

		if (storedSessions.length > 0) {
			return storedSessions;
		}

		const restoredBattles = loadFromStorage(BATTLE_STORAGE_KEY)
			.map(normalizeStoredBattle)
			.filter(Boolean);

		return buildSessionsFromBattles(restoredBattles);
	});
	const [activeSessionId, setActiveSessionId] = useState(() => {
		const storedSessions = loadFromStorage(SESSION_STORAGE_KEY)
			.map(normalizeStoredSession)
			.filter(Boolean)
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

		if (storedSessions.length > 0) {
			return storedSessions[0].id;
		}

		const restoredBattles = loadFromStorage(BATTLE_STORAGE_KEY)
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
	const [status, setStatus] = useState('ready');

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

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}
		window.localStorage.setItem(BATTLE_STORAGE_KEY, JSON.stringify(battles));
	}, [battles]);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}
		window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
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

		const response = await createBattleStream(prompt);
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
			setStatus('streaming');
			await streamBattle(prompt, battleId);
			setStatus('ready');
		} catch (error) {
			const message = 'Unable to reach the backend. Make sure the API server is running.';
			console.error('Failed to submit prompt:', error);
			setErrorMessage(message);
			setBattleError(battleId, message);
			setStatus('error');
		}
	};

	const sendCurrentPrompt = async () => {
		if (!inputValue.trim()) {
			return;
		}

		const prompt = inputValue.trim();
		setInputValue('');
		await startBattle(prompt);
	};

	const retryBattle = async (battle) => {
		await startBattle(battle.prompt, battle.id, battle.sessionId);
	};

	const newChat = () => {
		createAndActivateSession();
		setInputValue('');
		setErrorMessage('');

		if (typeof window !== 'undefined' && window.innerWidth < 1024) {
			setIsSidebarOpen(false);
		}
	};

	const openSession = (sessionId) => {
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

	const value = useMemo(() => ({
		battles,
		sessions,
		activeSessionId,
		inputValue,
		errorMessage,
		isSidebarOpen,
		isDraggingEdge,
		activeSessionBattles,
		historySessions,
		status,
		setInputValue,
		setIsSidebarOpen,
		toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
		sendCurrentPrompt,
		retryBattle,
		newChat,
		openSession,
		handleEdgeDragStart,
		handleEdgeDragMove,
		handleEdgeDragEnd,
		setStatus,
		storageKeys: {
			battles: BATTLE_STORAGE_KEY,
			sessions: SESSION_STORAGE_KEY,
		},
	}), [
		battles,
		sessions,
		activeSessionId,
		inputValue,
		errorMessage,
		isSidebarOpen,
		isDraggingEdge,
		activeSessionBattles,
		historySessions,
		status,
	]);

	return <ArenaContext.Provider value={value}>{children}</ArenaContext.Provider>;
}
