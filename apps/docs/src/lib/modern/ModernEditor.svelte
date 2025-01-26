<script lang="ts">
	import { Editor, SvelteLexicalEditor } from "svelte-lexical/core";

	import * as core from "lexical";

	import ModernEditorConfig from "./ModernEditorConfig.svelte";

	import { ModernHoverMenu } from "./menus";
	import { useContext } from "./lib";

	const context = useContext();

	let editor: SvelteLexicalEditor | undefined = $state();

	let initialized = false;

	$effect(() => {
		if (editor) {
			editor.editable = context.mode == null;

			if (!initialized) {
				initContent();
			}
		}
	});

	function initContent() {
		editor?.update(() => {
			const root = core.$getRoot();
			if (root.getFirstChild() === null) {
				const paragraph = core.$createParagraphNode();
				paragraph.append(
					core.$createTextNode("This demo environment is built with "),
					core.$createTextNode("svelte-lexical").toggleFormat("code"),
					core.$createTextNode("."),
					core.$createTextNode(" Try selecting "),
					core.$createTextNode("some text").toggleFormat("bold"),
					core.$createTextNode(" to change it to "),
					core.$createTextNode("different").toggleFormat("italic"),
					core.$createTextNode(" formats."),
				);
				root.append(paragraph);
			}
		});
		initialized = true;
	}
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

	:global(.sl-content) {
		border: 1px solid var(--sl-color-text);
		outline: none;
		padding: 2rem;
		border-radius: 1rem;
	}

	:global(pre) {
		max-height: 500px;
		overflow-y: auto;
	}
</style>
