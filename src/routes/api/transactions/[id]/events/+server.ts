import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async ({ params }) => {
	const txId = params.id;
	if (!txId) {
		return json({ error: 'Transaction ID required' }, { status: 400 });
	}
	const events = dbStore.getTransactionEvents(txId);
	return json(events);
};

export const POST: RequestHandler = async ({ params, request }) => {
	const txId = params.id;
	if (!txId) {
		return json({ error: 'Transaction ID required' }, { status: 400 });
	}
	try {
		const body = await request.json();
		const { event_type, actor_id, actor_name, actor_role, details } = body;

		dbStore.updateTransactionStatus(
			txId,
			event_type as any,
			{ id: actor_id, name: actor_name, role: actor_role },
			details || 'Event logged'
		);

		return json({ success: true });
	} catch (err: any) {
		return json({ error: err?.message || 'Failed to record event' }, { status: 400 });
	}
};
