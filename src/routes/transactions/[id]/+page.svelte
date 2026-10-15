<script lang="ts">
	import { page } from '$app/state';
	import { dbStore } from '$lib/stores/mockDatabase';
	import { authStore } from '$lib/stores/authStore';
	import { toast } from '$lib/stores/notificationStore';
	import TransactionStatusStepper from '$lib/components/transactions/TransactionStatusStepper.svelte';
	import EventAuditTimeline from '$lib/components/transactions/EventAuditTimeline.svelte';
	import SimulatedPaymentNotice from '$lib/components/ui/SimulatedPaymentNotice.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import {
		IconLock,
		IconCheckmark,
		IconClock,
		IconAlertCircle,
		IconFileText,
		IconReceipt,
		IconShieldCheck,
		IconFlag,
		IconPlus
	} from '$lib/components/icons';
	import type { TransactionMilestone } from '$lib/types/models';

	const txId = page.params.id || '';
	const currentUser = authStore;

	const transaction = $derived(dbStore.getTransactionById(txId));
	const events = $derived(dbStore.getTransactionEvents(txId));

	// Evidence upload modal state
	let isEvidenceModalOpen = $state(false);
	let evidenceTitle = $state('Completed Thesis Print Inspection Photo');
	let evidenceUrl = $state('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80');

	// Dispute modal state
	let isDisputeModalOpen = $state(false);
	let disputeReason = $state('Delay / Unapproved scope change');
	let disputeDetails = $state('');

	function handleAcceptAgreement() {
		if (!transaction) return;
		dbStore.updateTransactionStatus(
			transaction.id,
			'agreed',
			{ id: $currentUser.id, name: $currentUser.display_name, role: $currentUser.role },
			`${$currentUser.display_name} (${$currentUser.role}) formally accepted the agreed scope and price.`
		);
		toast.show({
			title: 'Agreement Signed',
			message: 'Terms are now locked. Simulated payment authorized.',
			type: 'success'
		});
	}

	function handleStartWork() {
		if (!transaction) return;
		dbStore.updateTransactionStatus(
			transaction.id,
			'in_progress',
			{ id: $currentUser.id, name: $currentUser.display_name, role: $currentUser.role },
			`Provider commenced active work execution.`
		);
		toast.show({
			title: 'Work Commenced',
			message: 'Job status moved to In Progress.',
			type: 'info'
		});
	}

	function handleToggleMilestone(milestoneId: string) {
		if (!transaction) return;
		dbStore.toggleMilestone(transaction.id, milestoneId);
		toast.show({
			title: 'Milestone Updated',
			message: 'Milestone checkpoint state toggled.',
			type: 'info'
		});
	}

	function handleUploadEvidence(e: SubmitEvent) {
		e.preventDefault();
		if (!transaction) return;
		dbStore.addEvidence(transaction.id, evidenceTitle, evidenceUrl, $currentUser.display_name);
		dbStore.updateTransactionStatus(
			transaction.id,
			'awaiting_confirmation',
			{ id: $currentUser.id, name: $currentUser.display_name, role: $currentUser.role },
			`Deliverable evidence attached ("${evidenceTitle}"). Marked ready for student inspection.`
		);
		toast.show({
			title: 'Evidence Submitted',
			message: 'Proof attached and transaction marked for buyer confirmation.',
			type: 'success'
		});
		isEvidenceModalOpen = false;
	}

	function handleConfirmCompletion() {
		if (!transaction) return;
		dbStore.updateTransactionStatus(
			transaction.id,
			'completed',
			{ id: $currentUser.id, name: $currentUser.display_name, role: $currentUser.role },
			`Buyer (${$currentUser.display_name}) confirmed physical collection & satisfaction. Simulated payment released.`
		);
		toast.show({
			title: 'Transaction Completed!',
			message: 'Both parties signed off. Simulated escrow funds released to provider.',
			type: 'success'
		});
	}

	function handleRaiseDispute(e: SubmitEvent) {
		e.preventDefault();
		if (!transaction) return;
		dbStore.updateTransactionStatus(
			transaction.id,
			'disputed',
			{ id: $currentUser.id, name: $currentUser.display_name, role: $currentUser.role },
			`Dispute raised by ${$currentUser.display_name}: "${disputeReason} - ${disputeDetails}"`
		);
		dbStore.addReport({
			reporter_id: $currentUser.id,
			reporter_name: $currentUser.display_name,
			target_type: 'transaction',
			target_id: transaction.id,
			reason: disputeReason,
			details: disputeDetails || 'Flagged for moderation on the Trust Desk.'
		});
		toast.show({
			title: 'Dispute Flagged',
			message: 'Transaction held in dispute. Routed to Trust Desk for campus moderation.',
			type: 'warning'
		});
		isDisputeModalOpen = false;
	}
</script>

<svelte:head>
	<title>{transaction ? `Agreement #${transaction.id}` : 'Transaction Workspace'} • AKOKA UNILAG</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
	{#if !transaction}
		<div class="py-16 text-center space-y-4">
			<IconAlertCircle size={32} class="text-rose-500 mx-auto" />
			<h2 class="text-lg font-bold text-slate-800">Transaction Agreement Not Found</h2>
			<p class="text-xs text-slate-500">The requested transaction record does not exist.</p>
			<a href="/transactions" class="text-xs font-semibold text-akoka-600 hover:underline">
				← Back to Documented Agreements
			</a>
		</div>
	{:else}
		<!-- Breadcrumb & Status Stepper Card -->
		<div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
				<div>
					<div class="flex items-center gap-2">
						<span class="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
							#{transaction.id}
						</span>
						<span class="text-xs text-slate-400">Documented Agreement</span>
					</div>
					<h1 class="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1">
						{transaction.item_title}
					</h1>
				</div>

				<div class="text-right">
					<div class="text-xs text-slate-400 font-medium">Agreed Contract Price</div>
					<div class="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
						₦{transaction.agreed_price.toLocaleString()}
					</div>
				</div>
			</div>

			<!-- Status Stepper Sequence (Section 8) -->
			<TransactionStatusStepper status={transaction.status} />

			<!-- Simulated Payment Status Box (Section 8 & 11) -->
			<div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div class="flex items-start gap-3">
					<div class="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
						<IconLock size={18} />
					</div>
					<div>
						<div class="flex items-center gap-2">
							<span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
								Simulated Escrow State
							</span>
							<span class="text-xs font-bold text-amber-950 capitalize">
								{transaction.simulated_payment.status.replace('_', ' ')}
							</span>
						</div>
						<p class="text-xs text-amber-900 mt-1 leading-relaxed">
							{transaction.simulated_payment.disclaimer}
						</p>
					</div>
				</div>

				<div class="shrink-0 text-right">
					<div class="text-[11px] font-mono text-amber-800">
						Amount: <strong>₦{transaction.simulated_payment.amount.toLocaleString()}</strong>
					</div>
					<div class="text-[10px] text-amber-600 italic">No banking API connected</div>
				</div>
			</div>

			<!-- Interactive Step Transition Action Bar -->
			<div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
				<div class="text-xs text-slate-500">
					Acting persona: <strong class="text-slate-800">{$currentUser.display_name} ({$currentUser.role})</strong>
				</div>

				<div class="flex flex-wrap items-center gap-2">
					{#if transaction.status === 'awaiting_agreement'}
						<Button variant="primary" size="sm" onclick={handleAcceptAgreement}>
							<IconCheckmark size={14} />
							<span>Sign & Accept Terms</span>
						</Button>
					{/if}

					{#if transaction.status === 'agreed'}
						<Button variant="primary" size="sm" onclick={handleStartWork}>
							<IconClock size={14} />
							<span>Commence Work Execution</span>
						</Button>
					{/if}

					{#if transaction.status === 'in_progress'}
						<Button variant="outline" size="sm" onclick={() => (isEvidenceModalOpen = true)}>
							<IconReceipt size={14} />
							<span>Submit Deliverable Proof</span>
						</Button>
					{/if}

					{#if transaction.status === 'awaiting_confirmation'}
						<Button variant="success" size="sm" onclick={handleConfirmCompletion}>
							<IconCheckmark size={14} />
							<span>Confirm Satisfaction & Release Funds</span>
						</Button>
					{/if}

					{#if transaction.status !== 'completed' && transaction.status !== 'disputed'}
						<Button variant="ghost" size="sm" class="text-rose-600 hover:text-rose-700 hover:bg-rose-50" onclick={() => (isDisputeModalOpen = true)}>
							<IconFlag size={14} />
							<span>Flag Issue / Dispute</span>
						</Button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Grid Layout: Agreement Details & Milestones vs Audit Trail -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Left 2 Cols: Agreement Specifications & Milestones -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Agreement Specifications Card -->
				<div class="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
					<div class="flex items-center justify-between pb-3 border-b border-slate-100">
						<h3 class="text-sm font-bold uppercase tracking-wider text-slate-900">
							Agreed Contract Specifications
						</h3>
						<span class="text-xs text-slate-400">Section 8 Workflow</span>
					</div>

					<!-- Parties Row -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
						<div>
							<div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Buyer (Student)</div>
							<div class="font-bold text-slate-900 mt-0.5">{transaction.buyer_name}</div>
							<div class="text-slate-500 font-mono text-[11px]">ID: {transaction.buyer_id}</div>
						</div>

						<div>
							<div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vendor (Provider)</div>
							<div class="font-bold text-slate-900 mt-0.5">{transaction.vendor_name}</div>
							<div class="text-slate-500 font-mono text-[11px]">ID: {transaction.vendor_id}</div>
						</div>
					</div>

					<!-- Scope of Work -->
					<div class="space-y-1.5 text-xs text-slate-700 leading-relaxed">
						<h4 class="font-bold text-slate-900 text-xs">Documented Scope & Inclusions</h4>
						<p class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
							{transaction.scope}
						</p>
					</div>

					<!-- Deliverables List -->
					<div class="space-y-2 text-xs">
						<h4 class="font-bold text-slate-900 text-xs">Required Deliverables & Standards</h4>
						<ul class="space-y-1.5">
							{#each transaction.deliverables as deliv}
								<li class="flex items-start gap-2 text-slate-700">
									<IconCheckmark size={14} class="text-emerald-600 shrink-0 mt-0.5" />
									<span>{deliv}</span>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Turnaround & Deadlines -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
						<div>
							<span class="text-slate-400 font-medium">Turnaround Baseline:</span>
							<div class="font-bold text-slate-800 mt-0.5">{transaction.turnaround_description}</div>
						</div>
						<div>
							<span class="text-slate-400 font-medium">Formal Due Date:</span>
							<div class="font-bold text-slate-800 mt-0.5">
								{new Date(transaction.due_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
							</div>
						</div>
					</div>

					<!-- Cancellation Policy -->
					<div class="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
						<span class="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Cancellation Policy</span>
						<p>{transaction.cancellation_terms}</p>
					</div>
				</div>

				<!-- Milestones Checkpoints Card -->
				<div class="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
					<div class="flex items-center justify-between pb-3 border-b border-slate-100">
						<div>
							<h3 class="text-sm font-bold uppercase tracking-wider text-slate-900">
								Milestone Checkpoints
							</h3>
							<p class="text-xs text-slate-500">Click to toggle progress during the live demo</p>
						</div>
						<span class="text-xs font-mono text-slate-400">
							{transaction.milestones.filter((m: TransactionMilestone) => m.completed).length}/{transaction.milestones.length} Done
						</span>
					</div>

					<div class="space-y-2.5">
						{#each transaction.milestones as milestone}
							<button
								type="button"
								onclick={() => handleToggleMilestone(milestone.id)}
								class="w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer {milestone.completed
									? 'bg-emerald-50/70 border-emerald-200 text-slate-900'
									: 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'}"
							>
								<div
									class="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors {milestone.completed
										? 'bg-emerald-600 border-emerald-600 text-white'
										: 'border-slate-300 bg-white'}"
								>
									{#if milestone.completed}
										<IconCheckmark size={13} />
									{/if}
								</div>

								<div class="flex-1 min-w-0 text-xs">
									<div class="flex items-center justify-between">
										<span class="font-bold {milestone.completed ? 'line-through text-slate-600' : 'text-slate-900'}">
											{milestone.title}
										</span>
										{#if milestone.completed_at}
											<span class="text-[10px] text-emerald-700 font-mono">
												Signed off {new Date(milestone.completed_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
											</span>
										{/if}
									</div>
									<p class="text-slate-500 text-[11px] mt-0.5">
										{milestone.description}
									</p>
								</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Evidence Attachments Gallery -->
				<div class="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
					<div class="flex items-center justify-between pb-3 border-b border-slate-100">
						<div>
							<h3 class="text-sm font-bold uppercase tracking-wider text-slate-900">
								Deliverables Evidence Gallery ({transaction.evidence_attachments.length})
							</h3>
							<p class="text-xs text-slate-500">Inspection photos uploaded for buyer review</p>
						</div>

						{#if transaction.status === 'in_progress' || transaction.status === 'awaiting_confirmation'}
							<Button variant="outline" size="sm" onclick={() => (isEvidenceModalOpen = true)}>
								<IconPlus size={14} />
								<span>Add Photo Proof</span>
							</Button>
						{/if}
					</div>

					{#if transaction.evidence_attachments.length === 0}
						<div class="p-6 rounded-2xl bg-slate-50 text-center text-xs text-slate-400 italic">
							No completion evidence has been attached yet. Provider uploads photos before collection.
						</div>
					{:else}
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{#each transaction.evidence_attachments as ev}
								<div class="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 text-xs">
									<img src={ev.url} alt={ev.title} class="w-full h-40 object-cover" />
									<div class="p-3 space-y-1">
										<div class="font-bold text-slate-900">{ev.title}</div>
										<div class="text-[10px] text-slate-500 flex items-center justify-between">
											<span>By: {ev.uploader}</span>
											<span>{new Date(ev.uploaded_at).toLocaleDateString('en-GB')}</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Right Col: Event Audit Trail -->
			<div class="space-y-6">
				<div class="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
					<EventAuditTimeline {events} />
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Modal: Submit Deliverable Evidence -->
<Modal
	isOpen={isEvidenceModalOpen}
	onclose={() => (isEvidenceModalOpen = false)}
	title="Submit Deliverable Evidence"
	subtitle="Upload photo proof of completed work for student verification"
	size="md"
>
	<form onsubmit={handleUploadEvidence} class="space-y-4">
		<div>
			<label for="ev-title" class="block text-xs font-semibold text-slate-700 mb-1">
				Evidence Description
			</label>
			<input
				id="ev-title"
				type="text"
				bind:value={evidenceTitle}
				placeholder="e.g. Completed Thesis Hardcover Gold Foil Photo"
				class="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
				required
			/>
		</div>

		<div>
			<label for="ev-url" class="block text-xs font-semibold text-slate-700 mb-1">
				Inspection Image URL / Photo
			</label>
			<input
				id="ev-url"
				type="url"
				bind:value={evidenceUrl}
				class="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
				required
			/>
			<div class="mt-2 rounded-xl overflow-hidden border border-slate-200">
				<img src={evidenceUrl} alt="Preview" class="w-full h-32 object-cover" />
			</div>
		</div>

		<div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
			<Button variant="outline" size="md" onclick={() => (isEvidenceModalOpen = false)}>Cancel</Button>
			<Button variant="primary" size="md" type="submit">Submit & Request Sign-off</Button>
		</div>
	</form>
</Modal>

<!-- Modal: Flag Issue / Dispute -->
<Modal
	isOpen={isDisputeModalOpen}
	onclose={() => (isDisputeModalOpen = false)}
	title="Flag Transaction Issue / Dispute"
	subtitle="Submit issue to the Trust Desk for campus moderation"
	size="md"
>
	<form onsubmit={handleRaiseDispute} class="space-y-4">
		<div>
			<label for="dispute-reason" class="block text-xs font-semibold text-slate-700 mb-1">
				Primary Reason
			</label>
			<select
				id="dispute-reason"
				bind:value={disputeReason}
				class="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
			>
				<option value="Unapproved scope or price hike">Unapproved scope or price hike</option>
				<option value="Deliverable quality defect">Deliverable quality defect</option>
				<option value="Missed completion deadline">Missed completion deadline</option>
				<option value="Failure to deliver agreed items">Failure to deliver agreed items</option>
			</select>
		</div>

		<div>
			<label for="dispute-details" class="block text-xs font-semibold text-slate-700 mb-1">
				Issue Description & Context
			</label>
			<textarea
				id="dispute-details"
				bind:value={disputeDetails}
				rows="3"
				placeholder="State specifically what diverged from the documented terms."
				class="w-full text-xs rounded-xl border border-slate-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
				required
			></textarea>
		</div>

		<div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
			<Button variant="outline" size="md" onclick={() => (isDisputeModalOpen = false)}>Cancel</Button>
			<Button variant="danger" size="md" type="submit">Submit Dispute to Trust Desk</Button>
		</div>
	</form>
</Modal>
