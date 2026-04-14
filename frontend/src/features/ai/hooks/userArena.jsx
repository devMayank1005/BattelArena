import { useContext } from 'react';
import { ArenaContext } from '../context/ai.context';

export default function userArena() {
	const context = useContext(ArenaContext);

	if (!context) {
		throw new Error('userArena must be used within ArenaProvider.');
	}

	return context;
}
