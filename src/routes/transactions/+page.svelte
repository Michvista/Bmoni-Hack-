<script lang="ts">
	import { dbStore } from '$lib/stores/mockDatabase';
	import { authStore } from '$lib/stores/authStore';
	import CreateTransactionModal from '$lib/components/transactions/CreateTransactionModal.svelte';
	import SimulatedPaymentNotice from '$lib/components/ui/SimulatedPaymentNotice.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		IconFileText,
		IconCheckmark,
		IconClock,
		IconAlertCircle,
		IconPlus,
		IconArrowRight,
		IconLock
	} from '$lib/components/icons';
	import type { Transaction, TransactionStatus } from '$lib/types/models';

	const currentUser = authStore;
	let statusFilter = $state<string>('all');
	let isCreateModalOpen = $state(false);

	const allTransactions = $derived(dbStore.getTransactions());

	const filteredTransactions = $derived.by(() => {
		if (statusFilter === 'all') return allTransactions;
		return allTransactions.filter((t: Transaction) => t.status === statusFilter);
	});

	function getStatusBadge(status: TransactionStatus): { label: string; class: string } {
		switch (status) {
			case 'draft':
				return { label: 'Draft', class: 'bg-slate-100 text-slate-700 border-slate-200' };
			case 'awaiting_agreement':
				return { label: 'Awaiting Agreement', class: 'bg-amber-50 text-amber-800 border-amber-200' };
			case 'agreed':
				return { label: 'Terms Agreed', class: 'bg-sky-50 text-sky-800 border-sky-200' };
			case 'in_progress':
				return { label: 'In Progress', class: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
			case 'awaiting_confirmation':
				return { label: 'Awaiting Sign-off', class: 'bg-purple-50 text-purple-800 border-purple-200' };
			case 'completed':
				return { label: 'Completed', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
			case 'disputed':
				return { label: 'Disputed', class: 'bg-rose-50 text-rose-800 border-rose-200' };
			case 'cancelled':
				return { label: 'Cancelled', class: 'bg-slate-100 text-slate-600 border-slate-200' };
			default:
				return { label: 'Unknown', class: 'bg-slate-100 text-slate-700 border-slate-200' };
		}
	}
</script>

<svelte:head>
	<title>Protected Transactions • AKOKA UNILAG</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
		<div>
			<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 mb-2">
				<IconFileText size={13} />
				<span>Protected Transaction Workflow</span>
			</div>
			<h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
				Documented Agreements
			</h1>
			<p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
				Formalize price, deliverables, turnaround expectations, and milestone checkpoints before campus work commences.
			</p>
		</div>

		<Button variant="primary" size="md" onclick={() => (isCreateModalOpen = true)}>
			<IconPlus size={16} />
			<span>Draft New Agreement</span>
		</Button>
	</div>

	<!-- Demo Notice Banner -->
	<SimulatedPaymentNotice />

	<!-- Filter Tabs -->
	<div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
		{#each [{ id: 'all', label: 'All Agreements' }, { id: 'awaiting_agreement', label: 'Awaiting Agreement' }, { id: 'in_progress', label: 'In Progress' }, { id: 'awaiting_confirmation', label: 'Awaiting Sign-off' }, { id: 'completed', label: 'Completed' }, { id: 'disputed', label: 'Disputed' }] as tab}
			<button
				type="button"
				onclick={() => (statusFilter = tab.id)}
				class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer {statusFilter ===
				tab.id
					? 'bg-slate-900 text-white shadow-xs'
					: 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Transactions Table / Cards List -->
	{#if filteredTransactions.length === 0}
		<div class="py-16 text-center p-8 rounded-2xl bg-white border border-slate-200 space-y-3">
			<IconFileText size={32} class="text-slate-400 mx-auto" />
			<h3 class="text-sm font-bold text-slate-800">No Documented Agreements Found</h3>
			<p class="text-xs text-slate-500 max-w-sm mx-auto">
				No transactions currently match this filter. Draft a new documented transaction to test the workflow.
			</p>
			<Button variant="outline" size="sm" onclick={() => (isCreateModalOpen = true)}>
				Draft First Transaction
			</Button>
		</div>
	{:else}
		<div class="space-y-4">
			{#each filteredTransactions as tx (tx.id)}
				{@const statusBadge = getStatusBadge(tx.status)}
				<a
					href="/transactions/{tx.id}"
					class="block p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-card transition-all group"
				>
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<!-- Left: ID, Title & Parties -->
						<div class="space-y-1.5 flex-1 min-w-0">
							<div class="flex items-center gap-2.5">
								<span class="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
									#{tx.id}
								</span>
								<span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border {statusBadge.class}">
									{statusBadge.label}
								</span>
							</div>

							<h3 class="text-base font-bold text-slate-900 group-hover:text-akoka-600 transition-colors truncate">
								{tx.item_title}
							</h3>

							<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
								<span>Buyer: <strong class="text-slate-700">{tx.buyer_name}</strong></span>
								<span>•</span>
								<span>Vendor: <strong class="text-slate-700">{tx.vendor_name}</strong></span>
								<span>•</span>
								<span>Turnaround: {tx.turnaround_description}</span>
							</div>
						</div>

						<!-- Right: Agreed Price & Action -->
						<div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
							<div class="text-right">
								<div class="text-xs text-slate-400 font-medium">Agreed Price</div>
								<div class="text-lg font-black text-slate-950 font-mono">
									₦{tx.agreed_price.toLocaleString()}
								</div>
							</div>

							<div class="inline-flex items-center gap-1.5 text-xs font-semibold text-akoka-600 group-hover:translate-x-0.5 transition-transform">
								<span>Open Workspace</span>
								<IconArrowRight size={14} />
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<!-- Modal for Drafting New Transaction -->
<CreateTransactionModal
	isOpen={isCreateModalOpen}
	onclose={() => (isCreateModalOpen = false)}
	onCreated={(id: string) => {
		window.location.href = `/transactions/${id}`;
	}}
/>
