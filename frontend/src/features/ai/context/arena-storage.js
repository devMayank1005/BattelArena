export function loadFromStorage(key) {
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

export function normalizeStoredSession(session) {
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

export function normalizeStoredBattle(battle) {
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

export function promptSnippet(prompt) {
	return prompt.length > 72 ? `${prompt.slice(0, 72)}...` : prompt;
}

export function createSession(id, title = 'New Chat') {
	const now = new Date().toISOString();
return {
		id,
		title,
		createdAt: now,
		updatedAt: now,
	};
}

export function createBattle(prompt, id, sessionId) {
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

export function buildSessionsFromBattles(battles) {
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

export function persistToStorage(key, value) {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.setItem(key, JSON.stringify(value));
}