# Nonograms

This is a Svelte implementation of a Nonogram puzzle game. It features a menu with multiple puzzles, a game screen with a timer, and simple progress saving to localStorage.

Site is hosted on GitHub Pages: https://scissorsneedfoodtoo.github.io/nonograms/

## Development

Requires [Node.js](https://nodejs.org/) 24+ and [pnpm](https://pnpm.io/) 10+.

```bash
pnpm install   # install dependencies
pnpm dev       # start the dev server with hot reloading
pnpm build     # build for production into dist/
pnpm preview   # serve the production build locally
```

Other useful scripts:

```bash
pnpm lint      # run ESLint
pnpm check     # type-check with svelte-check and tsc
pnpm format    # format with Prettier
```

## Testing

Unit tests run with [Vitest](https://vitest.dev/); end-to-end tests run with [Playwright](https://playwright.dev/).

```bash
pnpm test         # everything: unit tests, then e2e
pnpm test:unit    # unit tests only (fast)
pnpm test:e2e     # end-to-end tests only
pnpm test:e2e:ui  # end-to-end tests in Playwright's UI mode
```

The e2e suite drives a real browser, so install it once after cloning:

```bash
pnpm exec playwright install chromium
```

Without it, `pnpm test` (and `pnpm test:e2e`) will fail at the browser-launch step. The e2e config builds the app and serves it with `vite preview` automatically, so you don't need a dev server running.

## License

Copyright © 2014 freeCodeCamp.org

The content of this repository is bound by the following licenses:

- The computer software is licensed under the [BSD-3-Clause](LICENSE) license.
- The curriculum content is copyright © 2014 freeCodeCamp.org
