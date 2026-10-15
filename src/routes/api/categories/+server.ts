import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async () => {
	const categories = dbStore.getCategories();
	return json(categories);
};
