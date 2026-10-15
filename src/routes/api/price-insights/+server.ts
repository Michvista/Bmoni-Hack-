import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async ({ url }) => {
	const category = url.searchParams.get('category') || 'cat-print';
	const itemSpec = url.searchParams.get('itemSpec') || undefined;

	const insight = dbStore.calculatePriceInsight(category, itemSpec);
	return json(insight);
};
