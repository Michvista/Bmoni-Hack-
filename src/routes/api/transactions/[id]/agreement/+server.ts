import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const txId = params.id;
	if (!txId) {
		return json({ error: 'Transaction ID required' }, { status: 400 });
	}
	try {
		const body = await request.json();
		const { status, actor, details } = body;

		if (!status || !actor) {
			return json({ error: 'Missing status or actor payload' }, { status: 400 });
		}

		dbStore.updateTransactionStatus(txId, status, actor, details || `Agreement updated to ${status}`);
		const updated = dbStore.getTransactionById(txId);

		return json({ success: true, transaction: updated });
	} catch (err: any) {
		return json({ error: err?.message || 'Failed to update transaction agreement' }, { status: 400 });
	}
};
