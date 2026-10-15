import { apiClient } from './client';
import { dbStore } from '../stores/mockDatabase';
import type { PriceObservation, Report } from '../types/models';

export interface ModerationQueueResponse {
	pendingObservations: PriceObservation[];
	reports: Report[];
	pendingTransactions: any[];
}

export async function fetchModerationQueue(): Promise<ModerationQueueResponse> {
	try {
		return await apiClient.get<ModerationQueueResponse>('/admin/moderation-queue');
	} catch {
		const observations = dbStore.getObservations().filter((o) => o.verification_status === 'pending');
		const reports = dbStore.getReports().filter((r) => r.status === 'pending');
		const transactions = dbStore.getTransactions().filter((t) => t.status === 'disputed');
		return {
			pendingObservations: observations,
			reports,
			pendingTransactions: transactions
		};
	}
}

export async function moderateObservation(
	id: string,
	status: 'verified' | 'rejected' | 'flagged'
): Promise<void> {
	try {
		await apiClient.patch(`/admin/moderation-queue/observation/${id}`, { status });
	} catch {
		dbStore.verifyObservation(id, status);
	}
}

export async function resolveReport(id: string, action: 'resolved' | 'dismissed'): Promise<void> {
	try {
		await apiClient.patch(`/admin/moderation-queue/report/${id}`, { action });
	} catch {
		dbStore.resolveReport(id, action);
	}
}
