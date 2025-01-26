
# Svelte Lexical Redesign

This repo contains a prototype of a redesigned Svelte Lexical package. The goals for this redesign are:

1. Support modern editor features, particular hover toolbars and block editing UX
2. Allow users to use their own component libraries when building editors
3. Maintain Svelte Lexical & Lexical's modular and flexible design

The direction the codebase takes may make it prudent to break it up into several packages, but currently it includes only one prototype package.

## Organization

The monorepo uses [bun](https://bun.sh/), especially due to its support of [workspaces](https://bun.sh/docs/install/workspaces). This could easily be changed to `pnpm` if we want to be more conservative, but I was curious about `bun` and wanted to give it a go.

```
*
├── apps/
│   └── docs
├── packages/  
│   └── svelte-lexical
├── bun.lockb
├── package.json
└── README.md
```

## Package

A fresh package was setup for the purpose of the prototype using `bunx sv create`. The library option was chose, with Typescript, ESLint and Prettier. The package's codebase is in `packages/svelte-lexical/src/lib` as expected.

The code seperates a `core` API from extension `modules`. The `core` is dedicated to providing a Svelte 5 API to the `lexical` core package. Meanwhile each of the `modules` registers a plugin and corresponding theme from one of the various Lexical peripheral packages. The modules take advantage of Svelte syntax to register _both_ the plugin _and_ the corresponding theme in one file. This makes it easier to see everything one extension does in one place.

```
*
├── core/ - the base API
│   ├── state.svelte.ts - the core reactive editor class
│   ├── hook.svelte.ts - creates/retrieves an editor instance
│   ├── Editor.svelte - creates editor and offers prop & snippet API
│   └── types.ts
└── modules/ - plugin + theme extensions
    ├── CoreModule.svelte - `lexical`
    ├── DragonModule.svelte - `@lexical/dragon`
    ├── HistoryModule.svelte - `@lexical/history`
    ├── LinkModule.svelte - `@lexical/link`
    └── RichTextModule.svelte - `@lexical/rich-text`

```

Note that **the package contains to actual components**. The user must provide components, allowing the user to use their own component library for buttons and menus. The package *does* handle hover toolbar positioning (see `state.svelte.ts`); but the user must provide the interface to the library.

## Docs

A skeleton docs site is added via [Starlight](https://starlight.astro.build/), an [Astro](https://astro.build/) based static site builder designed specifically for docs.

This docs site is currently basically empty: the goal was to validate that its easy to develop the package with the docs, and to provide a place to test the package. Once the API has stabilized, I will start to document it here.

### Example

A usage example is found in `app/docs/src/lib/modern`. It demostrates what I would consider idiomatic editor code structure for the new API. To view it in action, go to the docs folder and run `bun run dev`, and browse to `localhost:4321`. Then open the 'Getting Started' page (big button in the frontpage splash).


