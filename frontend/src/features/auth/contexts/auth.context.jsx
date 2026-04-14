import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/auth.api';
import { clearArenaStorage } from '../../ai/services/battle.api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [authError, setAuthError] = useState('');

	const clearError = useCallback(() => {
		setAuthError('');
	}, []);

	const refreshUser = useCallback(async () => {
		const response = await getCurrentUser();
		setUser(response?.user || null);
		return response?.user || null;
	}, []);

	const login = useCallback(async (credentials) => {
		setIsLoading(true);
		clearError();

		try {
			const response = await loginUser(credentials);
			setUser(response?.user || null);
			return response;
		} catch (error) {
			setAuthError(error?.message || 'Unable to log in.');
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, [clearError]);

	const register = useCallback(async (credentials) => {
		setIsLoading(true);
		clearError();

		try {
			const response = await registerUser(credentials);
			setUser(response?.user || null);
			return response;
		} catch (error) {
			setAuthError(error?.message || 'Unable to register.');
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, [clearError]);

	const logout = useCallback(async () => {
		setIsLoading(true);
		clearError();

		try {
			await logoutUser();
		} catch (error) {
			setAuthError(error?.message || 'Unable to log out cleanly.');
		} finally {
			clearArenaStorage();
			setUser(null);
			setIsLoading(false);
		}
	}, [clearError]);

	useEffect(() => {
		let isMounted = true;

		const bootstrap = async () => {
			setIsLoading(true);

			try {
				const response = await getCurrentUser();
				if (isMounted) {
					setUser(response?.user || null);
				}
			} catch (error) {
				if (isMounted && error?.status !== 401) {
					setAuthError(error?.message || 'Unable to restore session.');
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		void bootstrap();

		return () => {
			isMounted = false;
		};
	}, []);

	const value = useMemo(() => ({
		user,
		isLoading,
		isAuthenticated: Boolean(user),
		authError,
		clearError,
		refreshUser,
		login,
		register,
		logout,
	}), [user, isLoading, authError, clearError, refreshUser, login, register, logout]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
