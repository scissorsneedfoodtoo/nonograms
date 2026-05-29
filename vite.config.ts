import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // Relative base so the built site works under the GitHub Pages
    // project subpath (https://<user>.github.io/nonograms/), and
    // also works when served from the root (for local development and
    // future deployment to a custom domain).
    base: './',
    plugins: [svelte()],
    server: {
      port: parseInt(env.PORT || '8080')
    }
  };
});
