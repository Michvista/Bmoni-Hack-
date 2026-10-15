import { apiClient } from './client';
import { dbStore } from '../stores/mockDatabase';
import type { Category } from '../types/models';

export async function fetchCategories(): Promise<Category[]> {
	try {
		return await apiClient.get<Category[]>('/categories');
	} catch {
		// Fallback to reactive local database store
		return dbStore.getCategories();
	}
}
