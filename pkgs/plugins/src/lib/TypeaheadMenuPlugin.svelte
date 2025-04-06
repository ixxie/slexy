<script lang="ts">
	import type { Snippet } from 'svelte';

	import { useEditor } from '@svelte-lexical/core';

	import * as core from 'lexical';

	export const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';

	function getTextUpToAnchor(selection: core.RangeSelection): string | null {
		const anchor = selection.anchor;
		if (anchor.type !== 'text') {
			return null;
		}
		const anchorNode = anchor.getNode();
		if (!anchorNode.isSimpleText()) {
			return null;
		}
		const anchorOffset = anchor.offset;
		return anchorNode.getTextContent().slice(0, anchorOffset);
	}

	function tryToPositionRange(leadOffset: number, range: Range, editorWindow: Window): boolean {
		const domSelection = core.getDOMSelection(editorWindow);
		if (domSelection === null || !domSelection.isCollapsed) {
			return false;
		}
		const anchorNode = domSelection.anchorNode;
		const startOffset = leadOffset;
		const endOffset = domSelection.anchorOffset;

		if (anchorNode == null || endOffset == null) {
			return false;
		}

		try {
			range.setStart(anchorNode, startOffset);
			range.setEnd(anchorNode, endOffset);
		} catch (error) {
			return false;
		}

		return true;
	}

	function getQueryTextForSearch(editor: core.LexicalEditor): string | null {
		let text = null;
		editor.getEditorState().read(() => {
			const selection = core.$getSelection();
			if (!core.$isRangeSelection(selection)) {
				return;
			}
			text = getTextUpToAnchor(selection);
		});
		return text;
	}

	function isSelectionOnEntityBoundary(editor: core.LexicalEditor, offset: number): boolean {
		if (offset !== 0) {
			return false;
		}
		return editor.getEditorState().read(() => {
			const selection = core.$getSelection();
			if (core.$isRangeSelection(selection)) {
				const anchor = selection.anchor;
				const anchorNode = anchor.getNode();
				const prevSibling = anchorNode.getPreviousSibling();
				return core.$isTextNode(prevSibling) && prevSibling.isTextEntity();
			}
			return false;
		});
	}

	// Got from https://stackoverflow.com/a/42543908/2013580
	export function getScrollParent(
		element: HTMLElement,
		includeHidden: boolean
	): HTMLElement | HTMLBodyElement {
		let style = getComputedStyle(element);
		const excludeStaticParent = style.position === 'absolute';
		const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
		if (style.position === 'fixed') {
			return document.body;
		}
		for (let parent: HTMLElement | null = element; (parent = parent.parentElement); ) {
			style = getComputedStyle(parent);
			if (excludeStaticParent && style.position === 'static') {
				continue;
			}
			if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
				return parent;
			}
		}
		return document.body;
	}

	export const SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND: core.LexicalCommand<{
		index: number;
		option: MenuOption;
	}> = core.createCommand('SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND');

	export function useBasicTypeaheadTriggerMatch(
		trigger: string,
		{ minLength = 1, maxLength = 75 }: { minLength?: number; maxLength?: number }
	): TriggerFn {
		return (text: string) => {
			const validChars = '[^' + trigger + PUNCTUATION + '\\s]';
			const TypeaheadTriggerRegex = new RegExp(
				'(^|\\s|\\()(' +
					'[' +
					trigger +
					']' +
					'((?:' +
					validChars +
					'){0,' +
					maxLength +
					'})' +
					')$'
			);
			const match = TypeaheadTriggerRegex.exec(text);
			if (match !== null) {
				const maybeLeadingWhitespace = match[1];
				const matchingString = match[3];
				if (matchingString.length >= minLength) {
					return {
						leadOffset: match.index + maybeLeadingWhitespace.length,
						matchingString,
						replaceableString: match[2]
					};
				}
			}
			return null;
		};
	}

	export type TypeaheadMenuPluginProps<TOption extends MenuOption> = {
		onQueryChange: (matchingString: string | null) => void;
		onSelectOption: (
			option: TOption,
			textNodeContainingQuery: core.TextNode | null,
			closeMenu: () => void,
			matchingString: string
		) => void;
		options: Array<TOption>;
		triggerFn: TriggerFn;
		onOpen?: (resolution: MenuResolution) => void;
		onClose?: () => void;
		anchorClassName?: string;
		commandPriority?: core.CommandListenerPriority;
		parent?: HTMLElement;
		preselectFirstItem?: boolean;
		children: Snippet;
	};

	const {
		options,
		onQueryChange,
		onSelectOption,
		onOpen,
		onClose,
		triggerFn,
		anchorClassName,
		commandPriority = core.COMMAND_PRIORITY_LOW,
		parent,
		preselectFirstItem = true,
		children
	}: TypeaheadMenuPluginProps<TOption> = $props();

	const editor = useEditor();

	let resolution = $state<MenuResolution | null>(null);
	const anchorElementRef = useMenuAnchorRef(resolution, setResolution, anchorClassName, parent);

	const closeTypeahead = () => {
		resolution = null;
		if (onClose != null && resolution !== null) {
			onClose();
		}
	};

	const openTypeahead = (res: MenuResolution) => {
		setResolution(res);
		if (onOpen != null && resolution === null) {
			onOpen(res);
		}
	};

	$effect(() => {
		const updateListener = () => {
			editor.getEditorState().read(() => {
				// Check if editor is in read-only mode
				if (!editor.isEditable()) {
					closeTypeahead();
					return;
				}

				const editorWindow = editor.window || window;
				const range = editorWindow.document.createRange();
				const selection = core.$getSelection();
				const text = getQueryTextForSearch(editor);

				if (
					!core.$isRangeSelection(selection) ||
					!selection.isCollapsed() ||
					text === null ||
					range === null
				) {
					closeTypeahead();
					return;
				}

				const match = triggerFn(text, editor);
				onQueryChange(match ? match.matchingString : null);

				if (match !== null && !isSelectionOnEntityBoundary(editor, match.leadOffset)) {
					const isRangePositioned = tryToPositionRange(match.leadOffset, range, editorWindow);
					if (isRangePositioned !== null) {
						openTypeahead({
							getRect: () => range.getBoundingClientRect(),
							match
						});
						return;
					}
				}
				closeTypeahead();
			});
		};

		const removeUpdateListener = editor.registerUpdateListener(updateListener);

		return () => {
			removeUpdateListener();
		};
	});

	$effect(() =>
		editor.registerEditableListener((isEditable) => {
			if (!isEditable) {
				closeTypeahead();
			}
		})
	);
</script>

{#if resolution !== null || editor !== null || anchorElementRef.current !== null}
	{@render children()}
{/if}
