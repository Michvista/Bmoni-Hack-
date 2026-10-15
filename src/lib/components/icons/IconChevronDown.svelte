<script lang="ts">
	let { size = 20, class: className = '', strokeWidth = 1.5 }: { size?: number; class?: string; strokeWidth?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
>
	<polyline points="6 9 12 15 18 9" />
</svg>
