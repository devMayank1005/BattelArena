function normalizeApiBaseUrl(url) {
	return String(url || '').trim().replace(/\/$/, '');
}

function fromEnv() {
	const explicitBase = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
	if (explicitBase) {
		return explicitBase;
	}

	const apiUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
	if (!apiUrl) {
		return '';
	}

	return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
}

function fromRenderHostname() {
	if (typeof window === 'undefined') {
		return '';
	}

	const host = window.location.hostname;
	if (!/-1\.onrender\.com$/i.test(host)) {
		return '';
	}

	const derivedHost = host.replace(/-1\.onrender\.com$/i, '.onrender.com');
	return `https://${derivedHost}/api`;
}

export function getApiBaseUrl() {
	return fromEnv() || fromRenderHostname() || '/api';
}

export function isInvalidProductionApiBase(apiBaseUrl) {
	if (typeof window === 'undefined') {
		return false;
	}

	const host = window.location.hostname;
	const isLocalHost = host === 'localhost' || host === '127.0.0.1';

	return !isLocalHost && apiBaseUrl.includes('localhost');
}
