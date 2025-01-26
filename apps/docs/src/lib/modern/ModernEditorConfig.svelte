<script lang="ts">
	import {
		CoreModule,
		LinkModule,
		DragonModule,
		HistoryModule,
		RichTextModule,
	} from "svelte-lexical/modules";

	import "./lib/icons.css";
</script>

<CoreModule />
<RichTextModule />
<HistoryModule />
<DragonModule />
<LinkModule />

<style>
	:root {
		--slex-link-color: var(--sl-color-text-accent);
		--slex-link-decoration: underline 1px dotted var(--sl-color-text-accent);
	}
</style>
