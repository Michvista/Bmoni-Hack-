import { writable, get } from 'svelte/store';
import {
	SEED_CATEGORIES,
	SEED_VENDORS,
	SEED_LISTINGS,
	SEED_OBSERVATIONS,
	SEED_TRANSACTIONS,
	SEED_EVENTS,
	SEED_REVIEWS,
	SEED_REPORTS
} from '../data/seedData';
import type {
	Category,
	VendorProfile,
	Listing,
	PriceObservation,
	PriceInsight,
	ConfidenceLevel,
	Transaction,
	TransactionEvent,
	Review,
	Report
} from '../types/models';

const STORAGE_KEY = 'akoka_campus_commerce_db_v1';

interface DatabaseState {
	categories: Category[];
	vendors: VendorProfile[];
	listings: Listing[];
	observations: PriceObservation[];
	transactions: Transaction[];
	events: TransactionEvent[];
	reviews: Review[];
	reports: Report[];
}

function loadInitialState(): DatabaseState {
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch (e) {
				console.error('Failed to parse local stored state, using seed data:', e);
			}
		}
	}
	return {
		categories: SEED_CATEGORIES,
		vendors: SEED_VENDORS,
		listings: SEED_LISTINGS,
		observations: SEED_OBSERVATIONS,
		transactions: SEED_TRANSACTIONS,
		events: SEED_EVENTS,
		reviews: SEED_REVIEWS,
		reports: SEED_REPORTS
	};
}

function createDatabaseStore() {
	const { subscribe, set, update } = writable<DatabaseState>(loadInitialState());

	function persist(state: DatabaseState) {
		if (typeof window !== 'undefined') {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			} catch (e) {
				console.warn('LocalStorage save failed:', e);
			}
		}
	}

	return {
		subscribe,
		resetToDefault: () => {
			const initial = {
				categories: SEED_CATEGORIES,
				vendors: SEED_VENDORS,
				listings: SEED_LISTINGS,
				observations: SEED_OBSERVATIONS,
				transactions: SEED_TRANSACTIONS,
				events: SEED_EVENTS,
				reviews: SEED_REVIEWS,
				reports: SEED_REPORTS
			};
			set(initial);
			persist(initial);
		},

		// Categories
		getCategories: (): Category[] => get({ subscribe }).categories,

		// Listings
		getListings: (filters?: {
			category?: string;
			area?: string;
			maxPrice?: number;
			search?: string;
		}): Listing[] => {
			const state = get({ subscribe });
			let results = state.listings.map((l) => ({
				...l,
				vendor: state.vendors.find((v) => v.id === l.vendor_id)
			}));

			if (filters?.category) {
				results = results.filter((l) => l.category_id === filters.category);
			}
			if (filters?.area) {
				results = results.filter(
					(l) => l.vendor?.campus_zone === filters.area || l.vendor?.service_area.includes(filters.area!)
				);
			}
			if (filters?.maxPrice && filters.maxPrice > 0) {
				results = results.filter((l) => l.price <= filters.maxPrice!);
			}
			if (filters?.search && filters.search.trim().length > 0) {
				const q = filters.search.toLowerCase();
				results = results.filter(
					(l) =>
						l.title.toLowerCase().includes(q) ||
						l.description.toLowerCase().includes(q) ||
						l.vendor?.business_name.toLowerCase().includes(q)
				);
			}

			return results;
		},

		getListingById: (id: string): Listing | undefined => {
			const state = get({ subscribe });
			const listing = state.listings.find((l) => l.id === id);
			if (!listing) return undefined;
			return {
				...listing,
				vendor: state.vendors.find((v) => v.id === listing.vendor_id)
			};
		},

		// Vendors
		getVendors: (): VendorProfile[] => get({ subscribe }).vendors,
		getVendorById: (id: string): VendorProfile | undefined => {
			return get({ subscribe }).vendors.find((v) => v.id === id);
		},

		// Observations
		getObservations: (categoryId?: string): PriceObservation[] => {
			const obs = get({ subscribe }).observations;
			if (categoryId) {
				return obs.filter((o) => o.category_id === categoryId);
			}
			return obs;
		},

		addObservation: (
			obs: Omit<PriceObservation, 'id' | 'observed_at' | 'last_confirmed_at' | 'verification_status'>
		): PriceObservation => {
			const now = new Date().toISOString();
			const newObs: PriceObservation = {
				...obs,
				id: `obs-${Date.now()}`,
				observed_at: now,
				last_confirmed_at: now,
				verification_status: 'pending',
				is_demo_data: true
			};

			update((s) => {
				const updated = {
					...s,
					observations: [newObs, ...s.observations]
				};
				persist(updated);
				return updated;
			});

			return newObs;
		},

		verifyObservation: (id: string, status: 'verified' | 'rejected' | 'flagged') => {
			update((s) => {
				const updated = {
					...s,
					observations: s.observations.map((o) =>
						o.id === id ? { ...o, verification_status: status, last_confirmed_at: new Date().toISOString() } : o
					)
				};
				persist(updated);
				return updated;
			});
		},

		// Price Insights Calculation
		calculatePriceInsight: (categoryId: string, itemSpec?: string): PriceInsight => {
			const state = get({ subscribe });
			const category = state.categories.find((c) => c.id === categoryId);
			const categoryName = category ? category.name : 'Unknown Category';

			// Filter verified observations for this category
			let obs = state.observations.filter(
				(o) => o.category_id === categoryId && o.verification_status === 'verified'
			);

			if (itemSpec && itemSpec.trim().length > 0) {
				obs = obs.filter((o) => o.item_specification.toLowerCase() === itemSpec.toLowerCase());
			}

			const sampleSize = obs.length;

			if (sampleSize === 0) {
				return {
					category_id: categoryId,
					category_name: categoryName,
					item_specification: itemSpec || 'General Category',
					sample_size: 0,
					median_price: null,
					range_low: null,
					range_high: null,
					confidence_level: 'insufficient_data',
					confidence_reason: 'Not enough recent, comparable observations to estimate a reliable price range yet.',
					freshness_days: 0,
					recent_trend: 'stable',
					comparable_observations: []
				};
			}

			const amounts = obs.map((o) => o.amount).sort((a, b) => a - b);
			const minPrice = amounts[0];
			const maxPrice = amounts[amounts.length - 1];

			// Calculate Median
			let median: number;
			const mid = Math.floor(amounts.length / 2);
			if (amounts.length % 2 === 0) {
				median = Math.round((amounts[mid - 1] + amounts[mid]) / 2);
			} else {
				median = amounts[mid];
			}

			// Calculate freshness (days since most recent observation)
			const timestamps = obs.map((o) => new Date(o.last_confirmed_at || o.observed_at).getTime());
			const newestTs = Math.max(...timestamps);
			const daysSinceNewest = Math.max(0, Math.round((Date.now() - newestTs) / (1000 * 60 * 60 * 24)));

			// Confidence level determination based on Section 7 Trust Model
			let confidence: ConfidenceLevel = 'low';
			let reason = 'Few independent observations found. Treat estimate with caution.';

			if (sampleSize >= 3 && daysSinceNewest <= 7) {
				confidence = 'high';
				reason = `High confidence: ${sampleSize} recent independent observations with verified vendor confirmation.`;
			} else if (sampleSize >= 2 && daysSinceNewest <= 14) {
				confidence = 'moderate';
				reason = `Moderate confidence: ${sampleSize} observations recorded within the last two weeks.`;
			} else if (sampleSize === 1) {
				confidence = 'low';
				reason = 'Single recorded observation. Additional campus submissions required for strong consensus.';
			}

			return {
				category_id: categoryId,
				category_name: categoryName,
				item_specification: itemSpec || obs[0]?.item_specification || 'Standard Offering',
				sample_size: sampleSize,
				median_price: median,
				range_low: minPrice,
				range_high: maxPrice,
				confidence_level: confidence,
				confidence_reason: reason,
				freshness_days: daysSinceNewest,
				recent_trend: amounts.length > 2 && amounts[amounts.length - 1] > amounts[0] ? 'increasing' : 'stable',
				comparable_observations: obs
			};
		},

		// Transactions
		getTransactions: (): Transaction[] => {
			const state = get({ subscribe });
			return state.transactions.map((t) => ({
				...t,
				vendor: state.vendors.find((v) => v.id === t.vendor_id)
			}));
		},

		getTransactionById: (id: string): Transaction | undefined => {
			const state = get({ subscribe });
			const tx = state.transactions.find((t) => t.id === id);
			if (!tx) return undefined;
			return {
				...tx,
				vendor: state.vendors.find((v) => v.id === tx.vendor_id)
			};
		},

		getTransactionEvents: (transactionId: string): TransactionEvent[] => {
			return get({ subscribe })
				.events.filter((e) => e.transaction_id === transactionId)
				.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
		},

		createTransaction: (data: {
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
		}): Transaction => {
			const state = get({ subscribe });
			const vendor = state.vendors.find((v) => v.id === data.vendor_id);
			const newId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
			const now = new Date().toISOString();

			const newTx: Transaction = {
				id: newId,
				buyer_id: data.buyer_id,
				buyer_name: data.buyer_name,
				vendor_id: data.vendor_id,
				vendor_name: vendor?.business_name || 'Campus Vendor',
				listing_id: data.listing_id,
				item_title: data.item_title,
				category_id: data.category_id,
				agreed_price: data.agreed_price,
				scope: data.scope,
				deliverables: data.deliverables,
				turnaround_description: data.turnaround_description,
				due_at: data.due_at,
				milestones: [
					{
						id: `m-${Date.now()}-1`,
						title: 'Agreement acceptance & proof of commencement',
						description: 'Both parties confirm agreed scope and materials are inspected',
						completed: false
					},
					{
						id: `m-${Date.now()}-2`,
						title: 'Primary deliverable execution',
						description: 'Core job completed and proof uploaded for student verification',
						completed: false
					},
					{
						id: `m-${Date.now()}-3`,
						title: 'Physical collection & handover confirmation',
						description: 'Student inspects work in person and signs off completion',
						completed: false
					}
				],
				status: 'awaiting_agreement',
				simulated_payment: {
					status: 'not_initiated',
					amount: data.agreed_price,
					disclaimer: 'DEMO ONLY: Payment is simulated. No money is collected or held by AKOKA.'
				},
				evidence_attachments: [],
				cancellation_terms: data.cancellation_terms || 'Mutual agreement required prior to deliverable commencement.',
				created_at: now,
				updated_at: now
			};

			const initialEvent: TransactionEvent = {
				id: `ev-${Date.now()}`,
				transaction_id: newId,
				actor_id: data.buyer_id,
				actor_name: data.buyer_name,
				actor_role: 'student',
				event_type: 'created',
				details: `Documented transaction drafted for ${data.item_title} (₦${data.agreed_price.toLocaleString()})`,
				created_at: now
			};

			update((s) => {
				const updated = {
					...s,
					transactions: [newTx, ...s.transactions],
					events: [...s.events, initialEvent]
				};
				persist(updated);
				return updated;
			});

			return newTx;
		},

		updateTransactionStatus: (
			transactionId: string,
			newStatus: Transaction['status'],
			actor: { id: string; name: string; role: any },
			details: string
		) => {
			const now = new Date().toISOString();
			const newEvent: TransactionEvent = {
				id: `ev-${Date.now()}`,
				transaction_id: transactionId,
				actor_id: actor.id,
				actor_name: actor.name,
				actor_role: actor.role,
				event_type:
					newStatus === 'agreed'
						? 'agreement_accepted'
						: newStatus === 'in_progress'
							? 'work_started'
							: newStatus === 'completed'
								? 'completion_confirmed'
								: newStatus === 'disputed'
									? 'issue_flagged'
									: 'agreement_proposed',
				details,
				created_at: now
			};

			update((s) => {
				const updated = {
					...s,
					transactions: s.transactions.map((tx) => {
						if (tx.id !== transactionId) return tx;
						let simPayment = { ...tx.simulated_payment };
						if (newStatus === 'agreed' || newStatus === 'in_progress') {
							simPayment.status = 'simulated_held';
						} else if (newStatus === 'completed') {
							simPayment.status = 'simulated_released';
						}
						return {
							...tx,
							status: newStatus,
							simulated_payment: simPayment,
							updated_at: now
						};
					}),
					events: [...s.events, newEvent]
				};
				persist(updated);
				return updated;
			});
		},

		toggleMilestone: (transactionId: string, milestoneId: string) => {
			const now = new Date().toISOString();
			update((s) => {
				const updated = {
					...s,
					transactions: s.transactions.map((tx) => {
						if (tx.id !== transactionId) return tx;
						return {
							...tx,
							milestones: tx.milestones.map((m) =>
								m.id === milestoneId
									? { ...m, completed: !m.completed, completed_at: !m.completed ? now : undefined }
									: m
							),
							updated_at: now
						};
					})
				};
				persist(updated);
				return updated;
			});
		},

		addEvidence: (transactionId: string, title: string, url: string, uploaderName: string) => {
			const now = new Date().toISOString();
			const newEvidence = {
				id: `ev-${Date.now()}`,
				title,
				url,
				uploader: uploaderName,
				uploaded_at: now
			};
			const newEvent: TransactionEvent = {
				id: `ev-log-${Date.now()}`,
				transaction_id: transactionId,
				actor_id: 'user-current',
				actor_name: uploaderName,
				actor_role: 'vendor',
				event_type: 'deliverable_submitted',
				details: `Evidence uploaded: "${title}"`,
				created_at: now
			};

			update((s) => {
				const updated = {
					...s,
					transactions: s.transactions.map((tx) =>
						tx.id === transactionId
							? { ...tx, evidence_attachments: [...tx.evidence_attachments, newEvidence], updated_at: now }
							: tx
					),
					events: [...s.events, newEvent]
				};
				persist(updated);
				return updated;
			});
		},

		// Reports & Moderation
		getReports: (): Report[] => get({ subscribe }).reports,

		addReport: (report: Omit<Report, 'id' | 'created_at' | 'status'>): Report => {
			const newReport: Report = {
				...report,
				id: `rep-${Date.now()}`,
				status: 'pending',
				created_at: new Date().toISOString()
			};
			update((s) => {
				const updated = {
					...s,
					reports: [newReport, ...s.reports]
				};
				persist(updated);
				return updated;
			});
			return newReport;
		},

		resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => {
			update((s) => {
				const updated = {
					...s,
					reports: s.reports.map((r) => (r.id === reportId ? { ...r, status: action } : r))
				};
				persist(updated);
				return updated;
			});
		},

		// Reviews
		getReviewsForVendor: (vendorId: string): Review[] => {
			return get({ subscribe }).reviews.filter((r) => r.vendor_id === vendorId);
		}
	};
}

export const dbStore = createDatabaseStore();
