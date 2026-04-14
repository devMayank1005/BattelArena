import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSteps from '../components/FeatureSteps';
import Toaster from '../components/Toaster';
import useAuth from '../hooks/useAuth';

export default function Home() {
	const { isAuthenticated, authError, clearError } = useAuth();

	return (
		<div className="min-h-screen bg-zinc-50">
			<Navbar />
			<HeroSection isAuthenticated={isAuthenticated} />
			<FeatureSteps />
			<Toaster message={authError} onClose={clearError} />
		</div>
	);
}
