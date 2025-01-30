<script lang="ts">
	import { useEditor } from "@svelte-lexical/core";

	import { ModernMenu, ModernButton } from "../lib";

	const editor = useEditor();

	editor.interface.mainMenu = mainMenu;
</script>

{#snippet mainMenu(cmds: { [key: string]: Function })}
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
	</ModernMenu>
{/snippet}
