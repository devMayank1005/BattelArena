export function selectActiveSessionBattles(battles, activeSessionId) {
	return battles.filter((battle) => battle.sessionId === activeSessionId);
}

export function selectHistorySessions(sessions) {
	return [...sessions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function selectSessionSummaryById(battles, historySessions) {
	const grouped = new Map();

	for (const battle of battles) {
		const entry = grouped.get(battle.sessionId) || { count: 0, lastBattle: null };
		entry.count += 1;
		entry.lastBattle = battle;
		grouped.set(battle.sessionId, entry);
	}

	for (const session of historySessions) {
		if (!grouped.has(session.id)) {
			grouped.set(session.id, { count: 0, lastBattle: null });
		}
	}

	return grouped;
}