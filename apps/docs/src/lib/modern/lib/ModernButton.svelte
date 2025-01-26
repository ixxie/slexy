<script lang="ts">
	import type { MouseEventHandler } from "svelte/elements";

	import { useContext } from "./context.svelte.ts";

	const {
		name,
		onclick,
		autohide = true,
	}: {
		name: string;
		onclick: MouseEventHandler<HTMLButtonElement>;
		autohide?: boolean;
	} = $props();

	const context = useContext();
</script>

{#if !(context.mode && autohide)}
	<button class="slex-button" {onclick} aria-label={name}>
		<div class="slex-icon" style="var(--slex-icon)"></div>
	</button>
{/if}

<style>
	.slex-button {
		border: none;
		padding: 0.2rem;
		font-weight: bold;
		border-radius: 1rem;
	}

	.slex-icon {
		width: var(--slex-icon-size, 1rem);
		height: var(--slex-icon-size, 1rem);
		mask: var(--slex-icon) center/100%;
		background-color: var(--sl-color-text);
	}
</style>
