import { on } from 'svelte/events';

import type { SvelteLexicalEditor } from '@svelte-lexical/core';

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

		// try to toggle on pointer events
		const rootNode = this.#editor.instance.getRootElement();
		if (rootNode) {
			this.#editor.console.info('registering root node listener for float toggle');
			on(rootNode, 'pointerup', () => {
				this.toggle();
			});
		}

		// deselect and hide toolbar on press
		this.#editor.console.info('registering document node listener for float element');
		on(document, 'pointerdown', () => {
			document.getSelection()?.removeAllRanges();
			this.hide();
		});

		// except when clicking the toolbar
		this.#editor.console.info('registering float element listener to stop propagation');
		on(element, 'pointerdown', (e) => {
			e.stopPropagation();
		});
	}

	show() {
		const { rect } = this.#editor.selection;
		this.#element.style.display = 'flex';
		this.#element.style.top = `calc(${rect?.top}px - ${this.#element.offsetHeight}px - 1.5rem)`;
		this.#element.style.left = `calc(${rect?.left}px + ${rect?.width}px / 2 - ${this.#element.offsetWidth}px / 2)`;
	}

	hide() {
		this.#element.style.display = 'none';
	}

	toggle() {
		const { active } = this.#editor.selection;
		if (active) {
			this.show();
		} else {
			this.hide();
		}
	}
}
