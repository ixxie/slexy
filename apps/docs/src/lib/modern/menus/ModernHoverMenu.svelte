<script lang="ts">
	import { useEditor } from "@svelte-lexical/core";
	import { Float } from "@svelte-lexical/float";

	import { ModernMenu, ModernButton } from "../lib";
	import { LinkTool } from "../tools";

	const editor = useEditor();
</script>

<Float>
	<ModernMenu>
		<ModernButton
			name="bold"
			onclick={() => editor.cmds.format("bold")}
			--slex-icon="var(--slex-bold-icon)"
		/>
		<ModernButton
			name="italic"
			onclick={() => editor.cmds.format("italic")}
			--slex-icon="var(--slex-italic-icon)"
		/>
		<LinkTool />
	</ModernMenu>
</Float>
