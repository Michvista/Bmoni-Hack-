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
	<line x1="5" y1="12" x2="19" y2="12" />
	<polyline points="12 5 19 12 12 19" />
</svg>
