import { apiClient } from './client';
import { dbStore } from '../stores/mockDatabase';
import type { VendorProfile, Review } from '../types/models';

export async function fetchVendors(): Promise<VendorProfile[]> {
	try {
		return await apiClient.get<VendorProfile[]>('/vendors');
	} catch {
		return dbStore.getVendors();
	}
}

export async function fetchVendorById(id: string): Promise<VendorProfile | undefined> {
	try {
		return await apiClient.get<VendorProfile>(`/vendors/${id}`);
	} catch {
		return dbStore.getVendorById(id);
	}
}

export async function fetchVendorReviews(id: string): Promise<Review[]> {
	try {
		return await apiClient.get<Review[]>(`/vendors/${id}/reviews`);
	} catch {
		return dbStore.getReviewsForVendor(id);
	}
}
