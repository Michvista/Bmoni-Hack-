import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async ({ url }) => {
	const category = url.searchParams.get('category') || undefined;
	const area = url.searchParams.get('area') || undefined;
	const maxPriceStr = url.searchParams.get('maxPrice');
	const maxPrice = maxPriceStr ? Number(maxPriceStr) : undefined;
	const search = url.searchParams.get('search') || undefined;

	const listings = dbStore.getListings({
		category,
		area,
		maxPrice,
		search
	});

	return json(listings);
};
