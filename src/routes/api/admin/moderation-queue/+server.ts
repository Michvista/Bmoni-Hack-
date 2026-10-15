import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async () => {
	const pendingObservations = dbStore.getObservations().filter((o) => o.verification_status === 'pending');
	const reports = dbStore.getReports().filter((r) => r.status === 'pending');
	const pendingTransactions = dbStore.getTransactions().filter((t) => t.status === 'disputed');

	return json({
		pendingObservations,
		reports,
		pendingTransactions
	});
};
