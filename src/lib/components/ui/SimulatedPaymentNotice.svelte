<script lang="ts">
	import { IconLock, IconInfo } from '$lib/components/icons';

	let {
		compact = false,
		class: className = ''
	}: {
		compact?: boolean;
		class?: string;
	} = $props();
</script>

{#if compact}
	<div
		class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50/90 text-amber-900 border border-amber-200/90 text-[11px] font-medium {className}"
	>
		<IconLock size={12} class="text-amber-600 shrink-0" />
		<span>DEMO ONLY • Payment is simulated (No real funds collected)</span>
	</div>
{:else}
	<div
		class="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs {className}"
	>
		<div class="p-1 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
			<IconLock size={16} />
		</div>
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<span class="font-bold uppercase tracking-wider text-[10px] px-1.5 py-0.5 bg-amber-200/80 text-amber-900 rounded">
					Demo Mode
				</span>
				<span class="font-semibold text-amber-900">Protected Transaction Simulator</span>
			</div>
			<p class="text-amber-800 leading-relaxed text-[12px]">
				Payment is simulated in this demo environment. No real funds are collected, processed, or held in escrow by AKOKA. Terms and milestones are formally documented before work starts.
			</p>
		</div>
	</div>
{/if}
