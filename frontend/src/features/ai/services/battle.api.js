const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export const BATTLE_STORAGE_KEY = 'battelarena:battles';
export const SESSION_STORAGE_KEY = 'battelarena:sessions';

export function clearArenaStorage() {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.removeItem(BATTLE_STORAGE_KEY);
	window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getBattleStreamUrl() {
	return `${API_BASE_URL}/v1/ai/invoke/stream`;
}

export async function createBattleStream(input) {
	const response = await fetch(getBattleStreamUrl(), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ query: input }),
	});

	if (!response.ok || !response.body) {
		throw new Error(`Battle request failed with status ${response.status}`);
	}

	return response;
}
