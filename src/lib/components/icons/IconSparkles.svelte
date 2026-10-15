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
	<path d="M12 3l1.912 5.885L20 10.797l-4.756 3.456 1.817 5.922L12 16.54l-5.061 3.635 1.817-5.922L4 10.797l6.088-1.912L12 3z" />
</svg>
