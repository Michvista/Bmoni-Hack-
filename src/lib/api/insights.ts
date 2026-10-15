import { apiClient } from './client';
import { dbStore } from '../stores/mockDatabase';
import type { PriceInsight, PriceObservation } from '../types/models';

export async function fetchPriceInsights(params: {
	category: string;
	itemSpec?: string;
}): Promise<PriceInsight> {
	try {
		return await apiClient.get<PriceInsight>('/price-insights', params);
	} catch {
		return dbStore.calculatePriceInsight(params.category, params.itemSpec);
	}
}

export async function submitPriceObservation(
	observation: Omit<PriceObservation, 'id' | 'observed_at' | 'last_confirmed_at' | 'verification_status'>
): Promise<PriceObservation> {
	try {
		return await apiClient.post<PriceObservation>('/price-observations', observation);
	} catch {
		return dbStore.addObservation(observation);
	}
}

export async function fetchObservations(categoryId?: string): Promise<PriceObservation[]> {
	try {
		return await apiClient.get<PriceObservation[]>('/price-observations', { category: categoryId });
	} catch {
		return dbStore.getObservations(categoryId);
	}
}
