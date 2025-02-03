
# Svelte Lexical Redesign

This repo contains a prototype of a redesigned Svelte Lexical package. The goals for this redesign are:

1. Support modern editor features, particular hover toolbars and block editing UX
2. Allow users to use their own component libraries when building editors
3. Maintain Svelte Lexical & Lexical's modular and flexible design

The direction the codebase takes may make it prudent to break it up into several packages, but currently it includes only one prototype package.


## Organization

The monorepo uses [bun](https://bun.sh/), especially due to its support of [workspaces](https://bun.sh/docs/install/workspaces). Fresh packages were set up using `bunx sv create`, with the library option. Typescript, ESLint and Prettier. It is structured as follows:


```
*
├── apps/
│   └── docs/     - a static(ish) docs site using Starlight
├── pkgs/
│   ├── core/     - core reactive Svelte API to `lexical`
│   ├── float/    - hover toolbar API using `floating-ui`
│   └── modules/  - extension plugins & themes to `@lexical/{module}`
├── bun.lockb
├── package.json
└── README.md
```

## Developing

1. Ensure you have [`bun`](https://bu.sh) installed
2. Go to project root and install: `cd ./slexy` and `bun install`
3. Run `bun dev` in the project root

This will run the website Astro dev server while executing `svelte-package -w` for each of the packages, ensure HMR for everything.

## Docs

A skeleton docs site is added via [Starlight](https://starlight.astro.build/), an [Astro](https://astro.build/) based static site builder designed specifically for docs.

This docs site is currently basically empty: the goal was to validate that its easy to develop the package with the docs, and to provide a place to test the package. Once the API has stabilized, I will start to document it here.

### Example

A usage example is found in `app/docs/src/lib/modern`. It demostrates what I would consider idiomatic editor code structure for the new API. To view it in action, go to the docs folder and run `bun dev`, and browse to `localhost:4321`. Then open the 'Getting Started' page (big button in the frontpage splash).


