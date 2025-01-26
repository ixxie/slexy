<script lang="ts">
  import { useEditor } from "svelte-lexical/core";

  import { ModernButton, ModernInput, useContext } from "../lib";

  const editor = useEditor();
  const context = useContext();

  let url = $state("https://");

  const initLink = () => {
    editor.commands.initLink();
    context.mode = "link";
  };

  const saveLink = () => {
    editor.commands.saveLink(url);
    context.mode = null;
  };
</script>

{#if !context.mode}
  <ModernButton
    name="Link"
    onclick={initLink}
    --slex-icon="var(--slex-link-icon)"
  />
{:else if context.mode == "link"}
  <ModernInput
    type="text"
    bind:value={url}
    onkeydown={(event) => {
      event.stopPropagation();
      if (event.key == "Enter") {
        saveLink();
      }
    }}
    style="border-radius: 1rem"
  />
  <ModernButton
    name="Add link"
    onclick={saveLink}
    --slex-icon="var(--slex-plus-icon)"
    autohide={false}
  />
{/if}
