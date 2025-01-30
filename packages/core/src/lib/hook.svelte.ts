import { setContext, getContext, hasContext } from 'svelte';

import {
	SvelteLexicalEditor,
	type SvelteLexicalConfig,
	defaults
} from './state.svelte';

export function useEditor(config: SvelteLexicalConfig = defaults) {
	let context: SvelteLexicalEditor;

	if (!hasContext('svelte-lexical-editor')) {
		context = new SvelteLexicalEditor(config);
		setContext('svelte-lexical-editor', context);
	} else {
		context = getContext<SvelteLexicalEditor>('svelte-lexical-editor');
	}
	return context;
}
