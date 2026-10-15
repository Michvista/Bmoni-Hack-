<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { fetchListings } from '$lib/api/listings';
	import { fetchVendors } from '$lib/api/vendors';
	import { fetchTransactions } from '$lib/api/transactions';
	import { apiClient } from '$lib/api/client';
	import { IconStore, IconFileText, IconArrowRight } from '$lib/components/icons';
	const user = authStore;
	let vendor = $state<import('$lib/types/models').VendorProfile | undefined>();
	let listings = $state<import('$lib/types/models').Listing[]>([]);
	let transactions = $state<import('$lib/types/models').Transaction[]>([]);
	let loadError = $state('');
	onMount(async () => { try { const [vendors, offers, agreements] = await Promise.all([fetchVendors(), fetchListings(), fetchTransactions()]); vendor = vendors.find((item) => item.user_id === $user?.id); listings = offers.filter((item) => item.vendor_id === vendor?.id); transactions = agreements.filter((item) => item.vendor?.user_id === $user?.id); } catch (error) { loadError = error instanceof Error ? error.message : 'Could not load vendor account.'; } });
	const openTransactions = $derived(transactions.filter((item) => !['completed', 'cancelled'].includes(item.status)).length);
</script>

<svelte:head><title>Vendor dashboard • AKOKA</title></svelte:head>
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">
	<div><p class="text-xs font-semibold uppercase tracking-wider text-akoka-700">Vendor portal</p><h1 class="text-3xl font-black text-slate-950 mt-1">{vendor?.business_name ?? `Welcome, ${$user?.display_name}`}</h1><p class="text-sm text-slate-500 mt-2">Manage your campus offers and respond to documented agreements.</p></div>
	{#if loadError}<div role="alert" class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{loadError}{#if !apiClient.backendConfigured} Configure the AKOKA backend to load your portal data.{/if}</div>{/if}
	{#if !vendor}<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Your account is not linked to a vendor profile yet. Ask the backend team to provision one for this account.</div>{/if}
	<div class="grid sm:grid-cols-3 gap-4">
		<div class="rounded-2xl bg-white border border-slate-200 p-5"><IconStore size={20} class="text-akoka-700"/><p class="text-xs text-slate-500 mt-4">Your listings</p><p class="text-2xl font-black">{listings.length}</p></div>
		<div class="rounded-2xl bg-white border border-slate-200 p-5"><IconFileText size={20} class="text-akoka-700"/><p class="text-xs text-slate-500 mt-4">Agreements</p><p class="text-2xl font-black">{transactions.length}</p></div>
		<div class="rounded-2xl bg-white border border-slate-200 p-5"><IconFileText size={20} class="text-akoka-700"/><p class="text-xs text-slate-500 mt-4">Needs attention</p><p class="text-2xl font-black">{openTransactions}</p></div>
	</div>
	<a href="/transactions" class="inline-flex items-center gap-2 rounded-xl bg-slate-950 text-white px-4 py-3 text-sm font-semibold">Open agreements <IconArrowRight size={16}/></a>
</main>
