import { apiClient } from './client';
import { dbStore } from '../stores/mockDatabase';
import type { Listing } from '../types/models';

export interface ListingFilterParams {
	category?: string;
	area?: string;
	maxPrice?: number;
	search?: string;
}

export async function fetchListings(filters?: ListingFilterParams): Promise<Listing[]> {
	try {
		return await apiClient.get<Listing[]>('/listings', filters);
	} catch {
		return dbStore.getListings(filters);
	}
}

export async function fetchListingById(id: string): Promise<Listing | undefined> {
	try {
		return await apiClient.get<Listing>(`/listings/${id}`);
	} catch {
		return dbStore.getListingById(id);
	}
}
