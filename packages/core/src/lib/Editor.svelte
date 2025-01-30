<script lang="ts">
	import { type Snippet } from 'svelte';

	import { useEditor } from './hook.svelte';
	import { type SvelteLexicalConfig, type SvelteLexicalEditor, defaults } from './state.svelte';

	let {
		children,
		config = defaults,
		debug = false,
		mainMenu,
		hoverMenu,
		blockMenu,
		editor = $bindable()
	}: {
		children: Snippet;
		config?: SvelteLexicalConfig;
		debug?: boolean;
		mainMenu?: Snippet<[{}]>;
		hoverMenu?: Snippet<[{}]>;
		blockMenu?: Snippet<[{}]>;
		editor?: SvelteLexicalEditor;
	} = $props();

	editor = useEditor(config);
</script>

{#if editor}
	<div class="svelte-lexical" use:editor.init>
		<!-- menus -->
		<div id="slex-main-menu">
			{@render (mainMenu ?? editor.interface.mainMenu)?.(editor.commands)}
		</div>
		<div id="slex-hover-menu">
			{@render (hoverMenu ?? editor.interface.hoverMenu)?.(editor.commands)}
		</div>
		<div id="slex-block-menu">
			{@render (blockMenu ?? editor.interface.blockMenu)?.(editor.commands)}
		</div>
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
