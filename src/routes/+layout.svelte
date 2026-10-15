<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import Footer from '$lib/components/navigation/Footer.svelte';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
	import SubmitObservationModal from '$lib/components/insights/SubmitObservationModal.svelte';

	let { children } = $props();

	let isSubmitModalOpen = $state(false);

	function openSubmitModal() {
		isSubmitModalOpen = true;
	}

	function closeSubmitModal() {
		isSubmitModalOpen = false;
	}
</script>

<div class="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-akoka-600 selection:text-white">
	<!-- Top Navigation -->
	<Navbar onOpenSubmitModal={openSubmitModal} />

	<!-- Main Content Area -->
	<main class="flex-1">
		{#if children}
			{@render children()}
		{/if}
	</main>

	<!-- Global Toast Notifications -->
	<ToastContainer />

	<!-- Global Price Observation Modal -->
	<SubmitObservationModal isOpen={isSubmitModalOpen} onclose={closeSubmitModal} />

	<!-- Footer -->
	<Footer />
</div>
