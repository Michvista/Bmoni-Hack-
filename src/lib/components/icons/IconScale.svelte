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
	<path d="M12 3v18" />
	<path d="M5 6l7-3 7 3" />
	<path d="M3 13l2-7h4l2 7a4 4 0 0 1-8 0z" />
	<path d="M13 13l2-7h4l2 7a4 4 0 0 1-8 0z" />
</svg>
