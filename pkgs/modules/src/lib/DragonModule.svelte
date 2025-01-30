<script lang="ts">
	import { registerDragonSupport } from '@lexical/dragon';

	import { useEditor } from '@svelte-lexical/core';

	const editor = useEditor();

	editor.plugin({
		name: 'dragon',
		register: (instance) => registerDragonSupport(instance)
	});
</script>
