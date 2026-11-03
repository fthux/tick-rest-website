import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { renderDocument } from '../src/document.js';
const dist = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');
await mkdir(new URL('zh-CN/', dist), { recursive: true });
await writeFile(new URL('index.html', dist), renderDocument(template, 'en'));
await writeFile(new URL('zh-CN/index.html', dist), renderDocument(template, 'zh-CN'));
console.log('Generated English and Simplified Chinese static pages.');
