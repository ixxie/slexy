<script lang="ts">
	import { Editor, SvelteLexicalEditor } from "svelte-lexical/core";

	import ModernEditorConfig from "./ModernEditorConfig.svelte";

	import { ModernHoverMenu } from "./menus";
	import { useContext } from "./lib";

	const context = useContext();

	let editor: SvelteLexicalEditor | undefined = $state();

	$effect(() => {
		if (editor) {
			editor.editable = context.mode == null;
		}
	});
</script>

<main>
	<Editor debug bind:editor>
		<ModernEditorConfig />
		<ModernHoverMenu />
	</Editor>
</main>

<style>
	main {
		margin-top: 3rem;
		max-width: 60ch;
	}
</style>
