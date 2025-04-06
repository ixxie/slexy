<script lang="ts">
	import { createEmptyHistoryState, registerHistory } from '@lexical/history';

	import { useEditor } from '@svelte-lexical/core';

	const editor = useEditor();

	editor.plugin({
		name: 'history',
		register: (instance) => registerHistory(instance, createEmptyHistoryState(), 300)
	});
</script>
