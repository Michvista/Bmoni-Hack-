import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async ({ params }) => {
	const txId = params.id;
	if (!txId) {
		return json({ error: 'Transaction ID required' }, { status: 400 });
	}
	const tx = dbStore.getTransactionById(txId);
	if (!tx) {
		return json({ error: 'Transaction not found' }, { status: 404 });
	}
	const events = dbStore.getTransactionEvents(txId);
	return json({
		...tx,
		events
	});
};
