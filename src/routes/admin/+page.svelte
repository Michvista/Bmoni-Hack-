<script lang="ts">
	import { dbStore } from '$lib/stores/mockDatabase';
	import { authStore } from '$lib/stores/authStore';
	import { toast } from '$lib/stores/notificationStore';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		IconShieldCheck,
		IconAlertCircle,
		IconCheckmark,
		IconX,
		IconRefresh,
		IconFlag,
		IconTagPrice,
		IconFileText
	} from '$lib/components/icons';

	const currentUser = authStore;

	const pendingObservations = $derived(
		dbStore.getObservations().filter((o) => o.verification_status === 'pending')
	);
	const verifiedObservations = $derived(
		dbStore.getObservations().filter((o) => o.verification_status === 'verified')
	);
	const pendingReports = $derived(
		dbStore.getReports().filter((r) => r.status === 'pending')
	);
	const disputedTransactions = $derived(
		dbStore.getTransactions().filter((t) => t.status === 'disputed')
	);

	function handleVerifyObs(id: string) {
		dbStore.verifyObservation(id, 'verified');
		toast.show({
			title: 'Observation Approved',
			message: 'Observation marked verified and integrated into statistical price insights.',
			type: 'success'
		});
	}

	function handleRejectObs(id: string) {
		dbStore.verifyObservation(id, 'rejected');
		toast.show({
			title: 'Observation Rejected',
			message: 'Observation discarded from calculation.',
			type: 'info'
		});
	}

	function handleResolveReport(id: string, action: 'resolved' | 'dismissed') {
		dbStore.resolveReport(id, action);
		toast.show({
			title: `Report ${action === 'resolved' ? 'Resolved' : 'Dismissed'}`,
			message: `Report #${id} updated.`,
			type: 'info'
		});
	}

	function handleResetDemo() {
		if (confirm('Reset all demo data back to clean initial seed dataset?')) {
			dbStore.resetToDefault();
			toast.show({
				title: 'Database Reset',
				message: 'Initial demo dataset restored.',
				type: 'info'
			});
		}
	}
</script>

<svelte:head>
	<title>Campus Trust & Moderation Desk • AKOKA UNILAG</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
		<div>
			<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
				<IconShieldCheck size={13} />
				<span>Section 11 Safety & Operational Desk</span>
			</div>
			<h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
				Campus Trust & Moderation Desk
			</h1>
			<p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
				Audit incoming price submissions, manage transaction dispute escalations, and maintain campus data integrity.
			</p>
		</div>

		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" onclick={handleResetDemo}>
				<IconRefresh size={14} />
				<span>Reset Demo State</span>
			</Button>
		</div>
	</div>

	<!-- Desk Metrics Overview -->
	<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
		<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
			<div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
				Pending Price Reviews
			</div>
			<div class="text-2xl font-black text-slate-900 font-mono">
				{pendingObservations.length}
			</div>
			<div class="text-[11px] text-amber-600 font-medium">Awaiting student audit</div>
		</div>

		<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
			<div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
				Active Verified Prices
			</div>
			<div class="text-2xl font-black text-slate-900 font-mono">
				{verifiedObservations.length}
			</div>
			<div class="text-[11px] text-emerald-600 font-medium">Powering live insights</div>
		</div>

		<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
			<div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
				Disputed Transactions
			</div>
			<div class="text-2xl font-black text-slate-900 font-mono">
				{disputedTransactions.length}
			</div>
			<div class="text-[11px] text-rose-600 font-medium">Requires mediation</div>
		</div>

		<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
			<div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
				Community Reports
			</div>
			<div class="text-2xl font-black text-slate-900 font-mono">
				{pendingReports.length}
			</div>
			<div class="text-[11px] text-slate-400">Flagged listings or prices</div>
		</div>
	</div>

	<!-- Queue 1: Pending Price Observations Moderation -->
	<div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-5">
		<div class="flex items-center justify-between pb-3 border-b border-slate-100">
			<div>
				<h3 class="text-sm font-bold uppercase tracking-wider text-slate-900">
					Pending Price Submissions Queue ({pendingObservations.length})
				</h3>
				<p class="text-xs text-slate-500">
					Student and vendor observations awaiting validation before affecting statistical medians
				</p>
			</div>
		</div>

		{#if pendingObservations.length === 0}
			<div class="py-8 text-center text-xs text-slate-400 italic">
				No pending price submissions in queue. Use the "Submit Price" button in the navigation to test submission.
			</div>
		{:else}
			<div class="space-y-3">
				{#each pendingObservations as obs}
					<div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<span class="font-bold text-slate-900 text-sm">{obs.item_specification}</span>
								<span class="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-amber-100 text-amber-800">
									{obs.source_type.replace('_', ' ')}
								</span>
							</div>

							<div class="text-slate-600">
								Observed Amount: <strong class="text-slate-950 font-mono text-sm">₦{obs.amount.toLocaleString()}</strong> /{obs.unit}
								<span class="mx-1">•</span>
								Area: <strong>{obs.area}</strong>
							</div>

							{#if obs.notes}
								<div class="text-slate-500 italic text-[11px]">"{obs.notes}"</div>
							{/if}
						</div>

						<div class="flex items-center gap-2 shrink-0">
							<Button variant="success" size="sm" onclick={() => handleVerifyObs(obs.id)}>
								<IconCheckmark size={14} />
								<span>Approve</span>
							</Button>

							<Button variant="outline" size="sm" class="text-rose-600 hover:text-rose-700" onclick={() => handleRejectObs(obs.id)}>
								<IconX size={14} />
								<span>Reject</span>
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Queue 2: Disputed Transactions Escalations -->
	<div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-5">
		<div class="flex items-center justify-between pb-3 border-b border-slate-100">
			<div>
				<h3 class="text-sm font-bold uppercase tracking-wider text-slate-900">
					Disputed Transactions Escalations ({disputedTransactions.length})
				</h3>
				<p class="text-xs text-slate-500">
					Documented agreements flagged for divergence or unmet expectations
				</p>
			</div>
		</div>

		{#if disputedTransactions.length === 0}
			<div class="py-8 text-center text-xs text-slate-400 italic">
				No disputed transactions currently active.
			</div>
		{:else}
			<div class="space-y-3">
				{#each disputedTransactions as tx}
					<div class="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<span class="font-mono font-bold text-rose-800">#{tx.id}</span>
								<span class="font-bold text-slate-900">{tx.item_title}</span>
								<span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-100 text-rose-800">
									Disputed
								</span>
							</div>

							<div class="text-slate-600">
								Agreed Price: <strong>₦{tx.agreed_price.toLocaleString()}</strong>
								<span class="mx-1">•</span>
								Buyer: <strong>{tx.buyer_name}</strong>
								<span class="mx-1">•</span>
								Vendor: <strong>{tx.vendor_name}</strong>
							</div>
						</div>

						<a
							href="/transactions/{tx.id}"
							class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-800 font-semibold text-xs shadow-2xs"
						>
							<span>Inspect Agreement</span>
							<IconFileText size={14} />
						</a>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Queue 3: Community Feedback & Price Reports -->
	<div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-5">
		<div class="flex items-center justify-between pb-3 border-b border-slate-100">
			<div>
				<h3 class="text-sm font-bold uppercase tracking-wider text-slate-900">
					Community Reports & Inaccuracy Flags ({pendingReports.length})
				</h3>
				<p class="text-xs text-slate-500">
					Reports submitted regarding stale prices or misleading provider scopes
				</p>
			</div>
		</div>

		{#if pendingReports.length === 0}
			<div class="py-8 text-center text-xs text-slate-400 italic">
				No unresolved reports in moderation desk.
			</div>
		{:else}
			<div class="space-y-3">
				{#each pendingReports as rep}
					<div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<span class="font-bold text-slate-900">{rep.reason}</span>
								<span class="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
									Target: {rep.target_type}
								</span>
							</div>
							<p class="text-slate-600">{rep.details}</p>
							<div class="text-[11px] text-slate-400">Reported by {rep.reporter_name}</div>
						</div>

						<div class="flex items-center gap-2 shrink-0">
							<Button variant="primary" size="sm" onclick={() => handleResolveReport(rep.id, 'resolved')}>
								Resolve
							</Button>
							<Button variant="outline" size="sm" onclick={() => handleResolveReport(rep.id, 'dismissed')}>
								Dismiss
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
