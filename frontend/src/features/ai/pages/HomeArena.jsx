import ChatInterface from '../../../components/ChatInterface';
import VaporTrailBackground from '../../../components/VaporTrailBackground';
import AmbientLighting from '../../../components/AmbientLighting';
import Navbar from '../../auth/components/Navbar';

export default function HomeArena() {
	return (
		<div className="min-h-screen bg-black relative overflow-hidden">
			<VaporTrailBackground />
			<AmbientLighting />
			<div className="relative z-10">
				<Navbar />
				<ChatInterface />
			</div>
		</div>
	);
}
