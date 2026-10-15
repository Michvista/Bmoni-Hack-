<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import SimulatedPaymentNotice from '$lib/components/ui/SimulatedPaymentNotice.svelte';
	import { dbStore } from '$lib/stores/mockDatabase';
	import { authStore } from '$lib/stores/authStore';
	import { toast } from '$lib/stores/notificationStore';
	import type { Listing, VendorProfile } from '$lib/types/models';

	let {
		isOpen = false,
		initialListing = undefined,
		initialVendor = undefined,
		onclose,
		onCreated
	}: {
		isOpen: boolean;
		initialListing?: Listing;
		initialVendor?: VendorProfile;
		onclose: () => void;
		onCreated?: (transactionId: string) => void;
	} = $props();

	const currentUser = authStore;
	const vendors = dbStore.getVendors();
	const categories = dbStore.getCategories();

	let selectedVendorId = $state(vendors[0]?.id || '');
	let selectedCategoryId = $state(categories[0]?.id || '');
	let itemTitle = $state('');
	let agreedPrice = $state<number | ''>('');
	let scopeDescription = $state('');
	let deliverablesText = $state('Completed work according to agreed specifications\nPhysical inspection sign-off');
	let turnaroundDescription = $state('24 hours standard');
	let dueDays = $state('2');
	let cancellationTerms = $state('Full simulated refund before work commencement; 50% simulated charge once material prep starts.');
	let isSubmitting = $state(false);

	$effect(() => {
		if (initialListing) {
			selectedVendorId = initialListing.vendor_id;
			selectedCategoryId = initialListing.category_id;
			itemTitle = initialListing.title;
			agreedPrice = initialListing.price;
			scopeDescription = initialListing.description;
			turnaroundDescription = initialListing.turnaround_time;
		} else if (initialVendor) {
			selectedVendorId = initialVendor.id;
		}
	});

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!agreedPrice || Number(agreedPrice) <= 0) {
			toast.show({
				title: 'Price Required',
				message: 'Please specify the agreed amount in Naira (₦)',
				type: 'error'
			});
			return;
		}

		if (!itemTitle.trim() || !scopeDescription.trim()) {
			toast.show({
				title: 'Missing Details',
				message: 'Please provide the title and clear scope of work.',
				type: 'error'
			});
			return;
		}

		isSubmitting = true;

		try {
			const dueDate = new Date();
			dueDate.setDate(dueDate.getDate() + Number(dueDays || '2'));

			const deliverables = deliverablesText
				.split('\n')
				.map((d) => d.trim())
				.filter((d) => d.length > 0);

			const newTx = dbStore.createTransaction({
				buyer_id: $currentUser.id,
				buyer_name: $currentUser.display_name,
				vendor_id: selectedVendorId,
				listing_id: initialListing?.id,
				item_title: itemTitle.trim(),
				category_id: selectedCategoryId,
				agreed_price: Number(agreedPrice),
				scope: scopeDescription.trim(),
				deliverables: deliverables.length > 0 ? deliverables : ['Completed deliverable'],
				turnaround_description: turnaroundDescription.trim(),
				due_at: dueDate.toISOString(),
				cancellation_terms: cancellationTerms.trim()
			});

			toast.show({
				title: 'Transaction Agreement Drafted',
				message: `Agreement #${newTx.id} created! Review terms and milestones in the workspace.`,
				type: 'success'
			});

			isSubmitting = false;
			onclose();
			if (onCreated) {
				onCreated(newTx.id);
			}
		} catch (err: any) {
			isSubmitting = false;
			toast.show({
				title: 'Error Creating Agreement',
				message: err?.message || 'Failed to draft agreement.',
				type: 'error'
			});
		}
	}
</script>

<Modal
	{isOpen}
	{onclose}
	title="Draft Documented Agreement"
	subtitle="Lock price, scope, deadlines, and milestones before service execution begins"
	size="lg"
>
	<form onsubmit={handleSubmit} class="space-y-4">
		<SimulatedPaymentNotice />

		<!-- Parties Summary -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
			<div>
				<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Buyer (Student)</span>
				<div class="text-xs font-bold text-slate-900 mt-0.5">{$currentUser.display_name}</div>
				<div class="text-[11px] text-slate-500">{$currentUser.matric_or_phone}</div>
			</div>

			<div>
				<label for="vendor-select" class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
					Service Provider
				</label>
				<select
					id="vendor-select"
					bind:value={selectedVendorId}
					class="w-full text-xs font-medium rounded-lg border border-slate-300 px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-akoka-500"
				>
					{#each vendors as ven}
						<option value={ven.id}>{ven.business_name} ({ven.physical_spot.split(',')[0]})</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Title & Price -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
			<div class="sm:col-span-2">
				<label for="item-title" class="block text-xs font-semibold text-slate-700 mb-1">
					Service / Job Title
				</label>
				<input
					id="item-title"
					type="text"
					bind:value={itemTitle}
					placeholder="e.g. Hardcover Thesis Binding (2 copies)"
					class="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
					required
				/>
			</div>

			<div>
				<label for="agreed-price" class="block text-xs font-semibold text-slate-700 mb-1">
					Agreed Price (₦)
				</label>
				<div class="relative">
					<span class="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₦</span>
					<input
						id="agreed-price"
						type="number"
						bind:value={agreedPrice}
						placeholder="6500"
						min="1"
						class="w-full text-xs font-semibold rounded-xl border border-slate-300 pl-7 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
						required
					/>
				</div>
			</div>
		</div>

		<!-- Scope Description -->
		<div>
			<label for="scope-desc" class="block text-xs font-semibold text-slate-700 mb-1">
				Documented Scope of Work (What is included)
			</label>
			<textarea
				id="scope-desc"
				bind:value={scopeDescription}
				rows="3"
				placeholder="State exact materials, color, page count, or repair parts included."
				class="w-full text-xs rounded-xl border border-slate-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
				required
			></textarea>
		</div>

		<!-- Specific Deliverables (Line by line) -->
		<div>
			<label for="deliverables-input" class="block text-xs font-semibold text-slate-700 mb-1">
				Key Deliverables & Inspection Criteria (One per line)
			</label>
			<textarea
				id="deliverables-input"
				bind:value={deliverablesText}
				rows="2"
				placeholder="e.g. Spine embossing proof preview&#10;2 bound volumes in navy buckram&#10;In-person inspection sign-off"
				class="w-full text-xs rounded-xl border border-slate-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
			></textarea>
		</div>

		<!-- Turnaround & Due Window -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<div>
				<label for="turnaround-input" class="block text-xs font-semibold text-slate-700 mb-1">
					Turnaround Expectation
				</label>
				<input
					id="turnaround-input"
					type="text"
					bind:value={turnaroundDescription}
					placeholder="e.g. 24 hours standard turnaround"
					class="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
				/>
			</div>

			<div>
				<label for="due-days" class="block text-xs font-semibold text-slate-700 mb-1">
					Completion Deadline
				</label>
				<select
					id="due-days"
					bind:value={dueDays}
					class="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
				>
					<option value="1">Within 24 Hours</option>
					<option value="2">Within 48 Hours (2 Days)</option>
					<option value="4">Within 4 Days</option>
					<option value="7">Within 1 Week</option>
				</select>
			</div>
		</div>

		<!-- Cancellation Terms -->
		<div>
			<label for="cancellation-input" class="block text-xs font-semibold text-slate-700 mb-1">
				Cancellation & Modification Policy
			</label>
			<input
				id="cancellation-input"
				type="text"
				bind:value={cancellationTerms}
				class="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-akoka-500"
			/>
		</div>

		<!-- Actions -->
		<div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
			<Button variant="outline" size="md" onclick={onclose}>Cancel</Button>
			<Button variant="primary" size="md" type="submit" loading={isSubmitting}>
				Propose Agreement Terms
			</Button>
		</div>
	</form>
</Modal>
