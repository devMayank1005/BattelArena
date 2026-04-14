import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthLoader from './AuthLoader';

export default function Protected({ children }) {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <AuthLoader />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	return children;
}
