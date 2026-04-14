import ChatInterface from '../../../components/ChatInterface';
import Navbar from '../../auth/components/Navbar';

export default function HomeArena() {
	return (
		<div className="min-h-screen bg-zinc-50">
			<Navbar />
			<ChatInterface />
		</div>
	);
}
