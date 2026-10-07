import { defineConfig } from 'astro/config';

// Static output only: AI crawlers don't run JavaScript, so every page must be
// complete HTML at build time. Interactive pieces (the demo) are islands.
export default defineConfig({
  site: 'https://memtory.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // The site renders ../facts.md, which sits outside the Astro root.
  vite: { server: { fs: { allow: ['..'] } } },
});
