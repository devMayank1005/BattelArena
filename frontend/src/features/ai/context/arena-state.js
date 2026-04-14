import { createSession } from './arena-storage';

export function ensureSessionInList(currentSessions, sessionId, titleHint) {
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
}

export function updateBattleInList(currentBattles, id, updater) {
	return currentBattles.map((battle) => {
		if (battle.id !== id) {
			return battle;
		}

		return {
			...battle,
			...updater(battle),
			updatedAt: new Date().toISOString(),
		};
	});
}

export function upsertBattleInList(currentBattles, battle) {
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
}