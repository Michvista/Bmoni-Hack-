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
	<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
	<line x1="8" y1="8" x2="16" y2="8" />
	<line x1="8" y1="12" x2="16" y2="12" />
	<line x1="8" y1="16" x2="13" y2="16" />
</svg>
