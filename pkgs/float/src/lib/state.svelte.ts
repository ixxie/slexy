import { on } from 'svelte/events';

import { computePosition, flip, offset, inline } from '@floating-ui/dom';

import type { SvelteLexicalEditor } from '@svelte-lexical/core';
import { onDestroy } from 'svelte';

export interface SvelteLexicalFloatConfig {
	zIndex: number;
}

export const defaults = {
	zIndex: 1000
};

export class SvelteLexicalFloat {
	#editor: SvelteLexicalEditor;
	#element: HTMLElement;

	constructor(
		editor: SvelteLexicalEditor,
		element: HTMLElement,
		config: SvelteLexicalFloatConfig = defaults
	) {
		this.#editor = editor;
		this.#element = element;

		if (!this.#editor.instance) {
			return;
		}

		// set hover styling
		Object.assign(this.#element.style, {
			position: 'absolute',
			'z-index': config.zIndex,
			display: 'none'
		});
		this.#editor.console.info('initializing float element');

		const cleanupHandler = this.#editor.onselection((selection) => {
			this.toggle(selection);
		});
		onDestroy(cleanupHandler);
	}

	show(selection: Selection) {
		const range = selection.getRangeAt(0);
		const virt = {
			getBoundingClientRect: () => range.getBoundingClientRect(),
			getClientRects: () => range.getClientRects()
		};
		this.#element.style.display = 'flex';
		computePosition(virt, this.#element, {
			placement: 'top',
			middleware: [inline(), offset(20)]
		}).then(({ x, y }) => {
			Object.assign(this.#element.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
	}

	hide() {
		this.#element.style.display = 'none';
	}

	toggle(selection: Selection | null) {
		if (selection) {
			this.show(selection);
		} else {
			this.hide();
		}
	}
}
