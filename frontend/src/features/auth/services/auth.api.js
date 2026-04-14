const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const AUTH_BASE_PATH = `${API_BASE_URL}/v1/auth`;
const REQUEST_TIMEOUT_MS = 15000;

export function getGoogleOAuthUrl() {
	return `${AUTH_BASE_PATH}/google`;
}

function buildHttpError(message, status) {
	const error = new Error(message || 'Request failed');
	error.status = status;
	return error;
}

async function request(path, options = {}) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	let response;
	try {
		response = await fetch(`${AUTH_BASE_PATH}${path}`, {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...(options.headers || {}),
			},
			signal: controller.signal,
			...options,
		});
	} catch (error) {
		if (error?.name === 'AbortError') {
			throw buildHttpError('Request timed out. Please try again.', 408);
		}

		throw buildHttpError('Unable to reach server. Check backend URL and deployment status.', 0);
	} finally {
		clearTimeout(timeoutId);
	}

	let payload = null;
	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (!response.ok) {
		throw buildHttpError(payload?.message || `Request failed (${response.status})`, response.status);
	}

	return payload;
}

export function loginUser(input) {
	return request('/login', {
		method: 'POST',
		body: JSON.stringify(input),
	});
}

export function registerUser(input) {
	return request('/signup', {
		method: 'POST',
		body: JSON.stringify(input),
	});
}

export function logoutUser() {
	return request('/logout', {
		method: 'POST',
	});
}

export function getCurrentUser() {
	return request('/me', {
		method: 'GET',
	});
}
