import { apiClient } from './client';
import type { Listing } from '../types/models';

export interface ListingFilterParams {
	category?: string;
	area?: string;
	maxPrice?: number;
	search?: string;
}

export async function fetchListings(filters?: ListingFilterParams): Promise<Listing[]> {
	return apiClient.get<Listing[]>('/listings', filters);
}

export async function fetchListingById(id: string): Promise<Listing | undefined> {
	return apiClient.get<Listing>(`/listings/${id}`);
}

