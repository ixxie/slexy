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
		<div id="sl-main-menu">
			{@render (mainMenu ?? editor.interface.mainMenu)?.(editor.commands)}
		</div>
		<div id="sl-hover-menu">
			{@render (hoverMenu ?? editor.interface.hoverMenu)?.(editor.commands)}
		</div>
		<div id="sl-block-menu">
			{@render (blockMenu ?? editor.interface.blockMenu)?.(editor.commands)}
		</div>
		<!-- content -->
		<article class="sl-content"></article>
		<!-- plugins & themes -->
		{@render children()}
		<!-- debugger -->
		{#if debug}
			<pre class="sl-debug">{JSON.stringify(editor.content, null, 2)}</pre>
		{/if}
	</div>
{/if}
