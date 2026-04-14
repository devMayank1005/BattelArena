import ChatInterface from '../../../components/ChatInterface';
import Navbar from '../../auth/components/Navbar';
import userArena from '../hooks/userArena';

export default function HomeArena() {
	const { status } = userArena();

	return (
		<div className="min-h-screen bg-zinc-50">
			<Navbar />
			{status === 'ready' ? <ChatInterface /> : null}
		</div>
	);
}
