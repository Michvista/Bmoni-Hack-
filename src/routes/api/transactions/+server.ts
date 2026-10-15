import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async () => {
	const transactions = dbStore.getTransactions();
	return json(transactions);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		if (!body.buyer_id || !body.vendor_id || !body.item_title || !body.agreed_price) {
			return json(
				{ error: 'Missing required transaction fields (buyer_id, vendor_id, item_title, agreed_price)' },
				{ status: 400 }
			);
		}

		const transaction = dbStore.createTransaction(body);
		return json(transaction, { status: 201 });
	} catch (err: any) {
		return json({ error: err?.message || 'Invalid request body' }, { status: 400 });
	}
};
