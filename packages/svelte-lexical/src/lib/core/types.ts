import * as core from 'lexical';

export interface SvelteLexicalPlugin {
	name: string;
	register?: (instance: core.LexicalEditor) => void;
	nodes?: (core.Klass<core.LexicalNode> | core.LexicalNodeReplacement)[];
	commands?: { [key: string]: (...args: any[]) => void };
}

export interface SvelteLexicalTheme {
	name: string;
	classes?: core.EditorThemeClasses;
}
