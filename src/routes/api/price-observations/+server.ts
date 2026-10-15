import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async ({ url }) => {
	const category = url.searchParams.get('category') || undefined;
	const observations = dbStore.getObservations(category);
	return json(observations);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		if (!body.category_id || !body.item_specification || !body.amount) {
			return json({ error: 'Missing required fields: category_id, item_specification, amount' }, { status: 400 });
		}

		const created = dbStore.addObservation(body);
		return json(created, { status: 201 });
	} catch (err: any) {
		return json({ error: err?.message || 'Invalid JSON payload' }, { status: 400 });
	}
};
