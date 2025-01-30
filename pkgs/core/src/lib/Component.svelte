<script lang="ts">
	import { type Snippet } from 'svelte';

	import { useEditor } from './hook.svelte';
	import { type SvelteLexicalConfig, type SvelteLexicalEditor, defaults } from './state.svelte';

	let {
		children,
		config = defaults,
		debug = false,
		editor = $bindable()
	}: {
		children: Snippet;
		config?: SvelteLexicalConfig;
		debug?: boolean;
		editor?: SvelteLexicalEditor;
	} = $props();

	editor = useEditor(config);
</script>

{#if editor}
	<div class="svelte-lexical" use:editor.init>
		<!-- content -->
		<article class="slex-content"></article>
		<!-- plugins & themes -->
		{@render children()}
		<!-- debugger -->
		{#if debug}
			<pre class="slex-debug">{JSON.stringify(editor.content, null, 2)}</pre>
		{/if}
	</div>
{/if}
