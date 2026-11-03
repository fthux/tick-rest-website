import { defineConfig } from 'vite';
import { renderDocument } from './src/document.js';
import { languageFromPath } from './src/seo.js';
export default defineConfig({
  plugins: [{
    name: 'localized-static-preview',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        return context.server ? renderDocument(html, languageFromPath(context.originalUrl || context.path)) : html;
      },
    },
  }],
});
