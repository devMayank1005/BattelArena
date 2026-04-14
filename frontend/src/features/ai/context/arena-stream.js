export function parseSseBlock(block) {
	const event = { type: 'message', data: '' };
	const lines = block.split('\n');

	for (const line of lines) {
		if (line.startsWith('event:')) {
			event.type = line.slice(6).trim();
		}

		if (line.startsWith('data:')) {
			event.data += line.slice(5).trimStart();
		}
	}

	try {
		return {
			type: event.type,
			data: event.data ? JSON.parse(event.data) : null,
		};
	} catch {
		return {
			type: event.type,
			data: event.data,
		};
	}
}

export async function consumeSseStream(response, onEvent) {
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { value, done } = await reader.read();
		buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

		let separatorIndex = buffer.indexOf('\n\n');
		while (separatorIndex !== -1) {
			const block = buffer.slice(0, separatorIndex).trim();
			buffer = buffer.slice(separatorIndex + 2);
			if (block) {
				onEvent(parseSseBlock(block));
			}
			separatorIndex = buffer.indexOf('\n\n');
		}

		if (done) {
			break;
		}
	}
}