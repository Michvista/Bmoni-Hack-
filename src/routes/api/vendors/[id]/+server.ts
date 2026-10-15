import { json, type RequestHandler } from '@sveltejs/kit';
import { dbStore } from '$lib/stores/mockDatabase';

export const GET: RequestHandler = async ({ params }) => {
	const vendorId = params.id;
	if (!vendorId) {
		return json({ error: 'Vendor ID required' }, { status: 400 });
	}
	const vendor = dbStore.getVendorById(vendorId);

	if (!vendor) {
		return json({ error: 'Vendor not found' }, { status: 404 });
	}

	const listings = dbStore.getListings().filter((l) => l.vendor_id === vendorId);
	const reviews = dbStore.getReviewsForVendor(vendorId);

	return json({
		vendor,
		listings,
		reviews
	});
};
