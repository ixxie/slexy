import * as core from 'lexical';

import type { Snippet } from 'svelte';
import { on } from 'svelte/events';

import type { SvelteLexicalPlugin, SvelteLexicalTheme } from './types.ts';

export interface SvelteLexicalConfig {
	log?: boolean;
}

export const defaults: SvelteLexicalConfig = {
	log: true
};

export class SvelteLexicalEditor {
	#instance: core.LexicalEditor | undefined = $state.raw();
	#plugins: SvelteLexicalPlugin[] = $state([]);
	#themes: SvelteLexicalTheme[] = $state([]);
	#content: {} = $state.raw({});
	#config: SvelteLexicalConfig;
	selection: SvelteLexicalSelection;
	editable: boolean = $state(true);
	interface: {
		[key: string]: Snippet<[{ [key: string]: Function }]> | null;
	} = $state({
		mainMenu: null,
		hoverMenu: null,
		blockMenu: null
	});

	public mode: string | null = $state(null);

	constructor(config: SvelteLexicalConfig = defaults) {
		this.#config = { ...defaults, ...config };
		$effect(() => {
			if (this.editable) {
				this.#instance?.setEditable(true);
			} else {
				this.#instance?.setEditable(false);
			}
		});
		// setup selection
		this.selection = new SvelteLexicalSelection();
	}

	init(node: HTMLElement) {
		// init instance
		this.console.info('creating editor instance');
		const options = {
			theme: coalesce(
				...this.#themes
					.map(({ classes }) => classes)
					.filter((c): c is core.EditorThemeClasses => c !== undefined)
			),
			editable: true,
			namespace: 'editor',
			nodes: this.nodes,
			onError: (error: Error) => {
				throw error;
			}
		};
		this.console.debug(options);
		this.#instance = core.createEditor(options);

		// sync content state
		this.console.info('registering content change event listener');
		this.#instance.registerUpdateListener(({ editorState }) => {
			this.console.debug('updating content state', editorState);
			this.#content = editorState.toJSON();
		});

		// setup editable content
		const contentNode: HTMLElement | null = node.querySelector('.slex-content');
		if (contentNode) {
			this.console.debug('registering content node', contentNode);
			contentNode.contentEditable = 'true';
			this.#instance.setRootElement(contentNode);
		}
	}

	plugin(plugin: SvelteLexicalPlugin) {
		this.console.info(`registering plugin ${plugin.name}`);
		this.#plugins.push(plugin);
		if (plugin?.register) {
			$effect(() =>
				this.#instance && plugin.register ? plugin.register(this.#instance) : () => {}
			);
		}
	}

	theme(theme: SvelteLexicalTheme) {
		this.console.info(`registering theme ${theme.name}`);
		this.#themes.push(theme);
	}

	update(updateFn: () => void, options?: core.EditorUpdateOptions) {
		this.#instance?.update(updateFn, options);
	}

	get instance() {
		return this.#instance;
	}

	get content() {
		return this.#content;
	}

	get commands() {
		return Object.fromEntries(
			this.#plugins.map(({ commands }) => (commands ? Object.entries(commands) : [])).flat()
		);
	}

	get cmds() {
		return this.commands;
	}

	get nodes() {
		return this.#plugins.map(({ nodes }) => nodes ?? []).flat();
	}

	get config() {
		return this.#config;
	}

	get console() {
		const prefix = '[svelte-lexical]';
		return this.config.log
			? {
					debug: (...args: Parameters<typeof console.debug>) => console.debug(prefix, ...args),
					info: (...args: Parameters<typeof console.info>) => console.info(prefix, ...args),
					log: (...args: Parameters<typeof console.log>) => console.log(prefix, ...args),
					warn: (...args: Parameters<typeof console.warn>) => console.warn(prefix, ...args),
					error: (...args: Parameters<typeof console.error>) => console.error(prefix, ...args)
				}
			: {
					debug: (..._: Parameters<typeof console.debug>) => {},
					info: (..._: Parameters<typeof console.info>) => {},
					log: (..._: Parameters<typeof console.log>) => {},
					warn: (..._: Parameters<typeof console.warn>) => {},
					error: (..._: Parameters<typeof console.error>) => {}
				};
	}
}

export class SvelteLexicalSelection {
	#rect: DOMRect | undefined = $state();
	#text: string | undefined = $state();
	#active: boolean = $state(false);

	constructor() {
		// listen to selection changes
		if (typeof window !== 'undefined') {
			on(document, 'selectionchange', () => {
				const selection = window?.getSelection();
				this.#rect =
					(selection?.rangeCount ?? 0) > 0
						? selection?.getRangeAt(0)?.getBoundingClientRect()
						: undefined;
				this.#text = selection?.toString();
				this.#active = !selection?.isCollapsed;
			});
		}
	}

	get rect() {
		return this.#rect;
	}
	get text() {
		return this.#text;
	}
	get active() {
		return this.#active;
	}
}

// internal utils

function coalesce(...themes: core.EditorThemeClasses[]): core.EditorThemeClasses {
	return themes.reduce(deepMerge);
}

function deepMerge(target: core.EditorThemeClasses, source: core.EditorThemeClasses) {
	Object.keys(source).forEach((key) => {
		if (isObject(source[key])) {
			if (!target[key]) Object.assign(target, { [key]: {} });
			deepMerge(target[key], source[key]);
		} else {
			Object.assign(target, { [key]: source[key] });
		}
	});
	return target;
}

function isObject(item: any) {
	return item && typeof item === 'object' && !Array.isArray(item);
}
