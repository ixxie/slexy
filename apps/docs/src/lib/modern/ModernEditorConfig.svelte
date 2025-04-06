<script lang="ts">
	import {
		CorePlugin,
		LinkPlugin,
		DragonPlugin,
		HistoryPlugin,
		RichTextPlugin,
	} from "@svelte-lexical/plugins";

	import "./lib/icons.css";
</script>

<CorePlugin />
<RichTextPlugin />
<HistoryPlugin />
<DragonPlugin />
<LinkPlugin />

<style>
	:root {
		--slex-link-color: var(--sl-color-text-accent);
		--slex-link-decoration: underline 1px dotted var(--sl-color-text-accent);
	}
</style>
