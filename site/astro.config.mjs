import { defineConfig } from 'astro/config';

// Static output only: AI crawlers don't run JavaScript, so every page must be
// complete HTML at build time. Interactive pieces (the demo) are islands.
export default defineConfig({
  site: 'https://memtory.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
