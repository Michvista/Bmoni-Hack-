import { apiClient } from './client';
import { dbStore } from '../stores/mockDatabase';
import type { Transaction, TransactionEvent } from '../types/models';

export async function fetchTransactions(): Promise<Transaction[]> {
	try {
		return await apiClient.get<Transaction[]>('/transactions');
	} catch {
		return dbStore.getTransactions();
	}
}

export async function fetchTransactionById(id: string): Promise<Transaction | undefined> {
	try {
		return await apiClient.get<Transaction>(`/transactions/${id}`);
	} catch {
		return dbStore.getTransactionById(id);
	}
}

export async function fetchTransactionEvents(id: string): Promise<TransactionEvent[]> {
	try {
		return await apiClient.get<TransactionEvent[]>(`/transactions/${id}/events`);
	} catch {
		return dbStore.getTransactionEvents(id);
	}
}

export async function createTransactionDraft(data: {
	buyer_id: string;
	buyer_name: string;
	vendor_id: string;
	listing_id?: string;
	item_title: string;
	category_id: string;
	agreed_price: number;
	scope: string;
	deliverables: string[];
	turnaround_description: string;
	due_at: string;
	cancellation_terms: string;
}): Promise<Transaction> {
	try {
		return await apiClient.post<Transaction>('/transactions', data);
	} catch {
		return dbStore.createTransaction(data);
	}
}

export async function updateTransactionAgreement(
	id: string,
	data: {
		status: Transaction['status'];
		actor: { id: string; name: string; role: any };
		details: string;
	}
): Promise<void> {
	try {
		await apiClient.patch(`/transactions/${id}/agreement`, data);
	} catch {
		dbStore.updateTransactionStatus(id, data.status, data.actor, data.details);
	}
}

export async function recordTransactionEvent(
	id: string,
	eventData: {
		event_type: string;
		actor_id: string;
		actor_name: string;
		actor_role: any;
		details: string;
	}
): Promise<void> {
	try {
		await apiClient.post(`/transactions/${id}/events`, eventData);
	} catch {
		dbStore.updateTransactionStatus(
			id,
			eventData.event_type as any,
			{ id: eventData.actor_id, name: eventData.actor_name, role: eventData.actor_role },
			eventData.details
		);
	}
}
