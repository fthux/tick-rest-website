import { renderPage } from './page.js';
import { metaMarkup } from './seo.js';
import { imageCandidates, heroSizes } from './images.js';
export function renderDocument(template, language) {
  if (!template.includes('<!--page-meta-->') || !template.includes('<div id="app"></div>')) throw new Error('Page template markers are missing');
  return template
    .replace('<html lang="en"', `<html lang="${language}"`)
    .replace('<!--page-meta-->', metaMarkup(language))
    .replace('<!--hero-preload-->', `<link rel="preload" as="image" href="/images/fullscreen-wallpaper.webp" imagesrcset="${imageCandidates('fullscreen-wallpaper')}" imagesizes="${heroSizes}">`)
    .replace('<div id="app"></div>', () => `<div id="app">${renderPage(language)}</div>`);
}
