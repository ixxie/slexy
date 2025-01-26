<script lang="ts">
	import type { Snippet } from "svelte";

	const { children }: { children: Snippet } = $props();
</script>

<menu class="slex-modern-menu">
	{@render children()}
</menu>

<style>
	.slex-modern-menu {
		height: 2.5rem;
		/* appearance */
		cursor: pointer;
		background: var(--sl-color-bg-nav);
		border-radius: 2rem;
		border: 1px solid var(--sl-color-gray-5);
		padding: 0.35rem;
		/* layout */
		display: flex;
		flex-flow: row;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
	}
</style>
