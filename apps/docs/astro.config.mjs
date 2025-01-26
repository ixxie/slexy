// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Svelte Lexical",
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
      },
      social: {
        github: "https://github.com/umaranis/svelte-lexical",
      },
      sidebar: [
        {
          label: "Guides",
          items: [{ label: "Getting started", slug: "guides/getting-started" }],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      customCss: ["./src/styles.css"],
    }),
    svelte(),
  ],
});
