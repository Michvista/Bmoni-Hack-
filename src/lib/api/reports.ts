import { apiClient } from './client';
import { dbStore } from '../stores/mockDatabase';
import type { Report } from '../types/models';

export async function submitReport(
	report: Omit<Report, 'id' | 'created_at' | 'status'>
): Promise<Report> {
	try {
		return await apiClient.post<Report>('/reports', report);
	} catch {
		return dbStore.addReport(report);
	}
}
