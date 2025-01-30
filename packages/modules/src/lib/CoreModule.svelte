<script lang="ts">
	import * as core from 'lexical';

	import { useEditor } from '@svelte-lexical/core';

	const editor = useEditor();

	editor.plugin({
		name: 'core',
		commands: {
			format: (style: core.TextFormatType) => {
				editor.instance?.dispatchCommand(core.FORMAT_TEXT_COMMAND, style);
			}
		}
	});

	editor.theme({
		name: 'type',
		classes: {
			text: {
				base: 'type-theme base',
				bold: 'type-theme bold',
				code: 'type-theme code',
				highlight: 'type-theme highlight',
				italic: 'type-theme italic',
				strikethrough: 'type-theme strikethrough',
				subscript: 'type-theme subscript',
				superscript: 'type-theme superscript',
				underline: 'type-theme underline',
				underlineStrikethrough: 'type-theme underline-strikethrough'
			}
		}
	});
</script>

<style>
	:global {
		.svelte-lexical .type-theme {
			&.base {
				font-family: var(--slex-type-font-family, inherit);
				color: inherit;
			}
			&.bold {
				font-weight: bold;
			}
			&.code {
				font-family: var(--slex-type-monospace, monospace);
			}
			&.highlight {
				display: inline-block;
				padding: 0.25em 0;
				background: var(--slex-type-highlight-color, orangered);
			}
			&.italic {
				font-style: italic;
			}
			&.strikethrough {
				text-decoration: line-through;
			}
			&.subscript {
				font-size: var(--slex-type-subscript-size, 0.7em);
				vertical-align: sub;
			}
			&.superscript {
				font-size: var(--slex-type-superscript-size, 0.7em);
				vertical-align: super;
			}
			&.underline {
				text-decoration: underline;
			}
			&.underline-strikethrough {
				text-decoration: line-through underline;
			}
		}
	}
</style>
