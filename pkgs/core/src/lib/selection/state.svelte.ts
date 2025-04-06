import { on } from 'svelte/events';

export class SvelteLexicalSelection {
	#version: number | null = $state(null);
	#container: HTMLElement | null = $state(null);

	constructor() {
		let cleanup: () => void;
		$effect(() => {
			if (this.#container) {
				cleanup = on(document, 'selectionchange', () => {
					if (!this.#container) {
						return;
					}
					const selection = window?.getSelection();
					const validDirection = selection?.direction !== 'none';
					const validAnchor = this.#container.contains(selection?.anchorNode ?? null);
					const validFocus = this.#container.contains(selection?.focusNode ?? null);
					//
					if (validDirection && validAnchor && validFocus) {
						if (this.#version) {
							// increment if exists
							this.#version++;
						} else {
							// reset otherwise
							this.#version = 1;
						}
					} else {
						//
						this.#version = null;
					}
				});
			} else {
				if (cleanup) {
					cleanup();
				}
			}
		});
	}

	get current() {
		return this.#version ? window?.getSelection() : null;
	}

	get container() {
		return this.#container;
	}

	set container(value: HTMLElement | null) {
		this.#container = value;
	}
}
