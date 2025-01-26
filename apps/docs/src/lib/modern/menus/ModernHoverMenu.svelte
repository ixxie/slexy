<script lang="ts">
	import { useEditor } from "svelte-lexical/core";

	import { ModernMenu, ModernButton } from "../lib";
	import { LinkTool } from "../tools";

	const editor = useEditor();

	editor.interface.hoverMenu = hoverMenu;
</script>

{#snippet hoverMenu(cmds: { [key: string]: Function })}
	<ModernMenu>
		<ModernButton
			name="bold"
			onclick={() => cmds.format("bold")}
			--slex-icon="var(--slex-bold-icon)"
		/>
		<ModernButton
			name="italic"
			onclick={() => cmds.format("italic")}
			--slex-icon="var(--slex-italic-icon)"
		/>
		<LinkTool />
	</ModernMenu>
{/snippet}
