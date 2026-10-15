import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async () => {
	const reports = dbStore.getReports();
	return json(reports);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		if (!body.target_type || !body.target_id || !body.reason) {
			return json({ error: 'Missing required report fields' }, { status: 400 });
		}
		const created = dbStore.addReport(body);
		return json(created, { status: 201 });
	} catch (err: any) {
		return json({ error: err?.message || 'Invalid report body' }, { status: 400 });
	}
};
