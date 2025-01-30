<script lang="ts">
	import { type Snippet } from 'svelte';

	import { useEditor, type SvelteLexicalEditor } from '@svelte-lexical/core';

	import { useFloat } from './hook.svelte.js';
	import { type SvelteLexicalFloat, type SvelteLexicalFloatConfig, defaults } from './state.svelte';

	let {
		children,
		editor,
		config = defaults
	}: {
		children: Snippet<
			[
				{
					float: SvelteLexicalFloat;
					editor: SvelteLexicalEditor;
				}
			]
		>;
		config?: SvelteLexicalFloatConfig;
		editor?: SvelteLexicalEditor;
	} = $props();

	editor = editor ?? useEditor();

	let element: HTMLElement | undefined = $state();
	let float: SvelteLexicalFloat | undefined = $state();

	$effect(() => {
		if (element && !float) {
			float = useFloat(editor, element, config);
		}
	});
</script>

{#if editor.instance}
	<div bind:this={element}>
		{#if float}
			{@render children({ float, editor })}
		{/if}
	</div>
{/if}
