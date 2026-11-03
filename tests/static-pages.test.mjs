import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { content } from '../src/copy.js';
import { metadata, site } from '../src/seo.js';
const dist = new URL('../dist/', import.meta.url);

test('both languages provide complete static HTML and localized share metadata', async () => {
  for (const [language, file, path] of [['en', 'index.html', '/'], ['zh-CN', 'zh-CN/index.html', '/zh-CN/']]) {
    const html = await readFile(new URL(file, dist), 'utf8');
    assert.ok(html.includes(`<html lang="${language}"`));
    assert.ok(html.includes(`<h1>${content[language].hero}</h1>`));
    assert.ok(html.includes(content[language].signingNote));
    assert.ok(html.includes('brew install --cask fthux/tap/tickrest'));
    assert.equal((html.match(/<details id="faq-/g) || []).length, 5);
    assert.ok(html.includes(`<link rel="canonical" href="${site}${path}">`));
    assert.ok(html.includes(`<meta property="og:title" content="${metadata[language].title}">`));
    assert.ok(html.includes(`<meta property="og:image" content="${site}${metadata[language].image}">`));
    for (const lang of ['en', 'zh-CN', 'x-default']) assert.ok(html.includes(`hreflang="${lang}"`));
    assert.ok(!html.includes('<!--page-meta-->'));
    assert.ok(!html.includes('<div id="app"></div>'));
    assert.ok(html.includes('class="language-fallback"'));
    assert.ok(!html.includes('tick-rest-windows'));
    // Every emitted local URL must resolve in the deployable output.
    const paths = [...html.matchAll(/(?:src|href)="(\/(?!\/)[^"#]*)"/g)].map(match => match[1]);
    for (const url of paths) await access(new URL(url.slice(1) + (url.endsWith('/') ? 'index.html' : ''), dist));
    for (const match of html.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)) {
      for (const candidate of match[1].split(', ')) await access(new URL(candidate.split(' ')[0].slice(1), dist));
    }
  }
});

test('translations cover the same keys and FAQ topics', () => {
  assert.deepEqual(Object.keys(content.en).sort(), Object.keys(content['zh-CN']).sort());
  assert.equal(content.en.faqs.length, content['zh-CN'].faqs.length);
  assert.equal(content['zh-CN'].minuteUnit, '分钟');
});

test('responsive screenshots preserve aspect ratios and provide smaller candidates', async () => {
  const sharp = (await import('sharp')).default;
  const manifest = JSON.parse(await readFile(new URL('../src/image-manifest.json', import.meta.url), 'utf8'));
  for (const [name, image] of Object.entries(manifest)) {
    for (const width of image.widths) {
      const file = `images/${name}${width === image.width ? '' : `-${width}w`}.webp`;
      const actual = await sharp(new URL(file, dist).pathname).metadata();
      assert.equal(actual.width, width);
      assert.ok(Math.abs(actual.height - width * image.height / image.width) <= 1);
    }
  }
  assert.ok(manifest['fullscreen-wallpaper'].widths.includes(480));
  assert.ok(manifest['gallery-2-light'].widths.includes(960));
});
