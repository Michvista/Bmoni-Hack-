/**
 * AKOKA API Client
 * Clean HTTP client wrapper with error handling, typing, and automatic fallback
 * to local reactive store when external backend is not configured or in offline demo mode.
 */

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	meta?: Record<string, any>;
}

export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string = import.meta.env.PUBLIC_API_BASE_URL || '/api') {
		this.baseUrl = baseUrl.replace(/\/$/, '');
	}

	async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
		let url = `${this.baseUrl}${endpoint}`;
		if (params) {
			const search = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					search.append(key, String(value));
				}
			});
			const queryString = search.toString();
			if (queryString) {
				url += `?${queryString}`;
			}
		}

		try {
			const res = await fetch(url, {
				headers: {
					Accept: 'application/json'
				}
			});

			if (!res.ok) {
				throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
			}

			return await res.json();
		} catch (err: any) {
			console.warn(`[AKOKA API GET ${endpoint}] fallback or error:`, err?.message);
			throw err;
		}
	}

	async post<T>(endpoint: string, body?: any): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: body ? JSON.stringify(body) : undefined
			});

			if (!res.ok) {
				throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
			}

			return await res.json();
		} catch (err: any) {
			console.warn(`[AKOKA API POST ${endpoint}] fallback or error:`, err?.message);
			throw err;
		}
	}

	async patch<T>(endpoint: string, body?: any): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		try {
			const res = await fetch(url, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: body ? JSON.stringify(body) : undefined
			});

			if (!res.ok) {
				throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
			}

			return await res.json();
		} catch (err: any) {
			console.warn(`[AKOKA API PATCH ${endpoint}] fallback or error:`, err?.message);
			throw err;
		}
	}
}

export const apiClient = new ApiClient();

