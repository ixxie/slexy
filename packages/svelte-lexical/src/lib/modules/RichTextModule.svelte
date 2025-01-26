<script lang="ts">
	import { registerRichText } from '@lexical/rich-text';

	import { useEditor } from '../core';

	const editor = useEditor();

	editor.plugin({
		name: 'rich-text',
		register: (instance) => registerRichText(instance)
	});
</script>
