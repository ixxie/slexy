import { setContext, getContext, hasContext } from 'svelte';

import type { SvelteLexicalEditor } from '@svelte-lexical/core';
import { SvelteLexicalFloat, type SvelteLexicalFloatConfig, defaults } from './state.svelte.js';

export function useFloat(
	editor: SvelteLexicalEditor,
	element: HTMLElement,
	config: SvelteLexicalFloatConfig = defaults
) {
	let context: SvelteLexicalFloat;

	if (!hasContext('svelte-lexical-float')) {
		context = new SvelteLexicalFloat(editor, element, config);
		setContext('svelte-lexical-float', context);
	} else {
		context = getContext<SvelteLexicalFloat>('svelte-lexical-float');
	}
	return context;
}
