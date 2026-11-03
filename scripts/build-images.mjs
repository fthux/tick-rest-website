import { readdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const folder = new URL('../public/images/', import.meta.url);
const sources = (await readdir(folder)).filter(name => name.endsWith('.webp') && !/-\d+w\.webp$/.test(name));
const manifest = {};
for (const file of sources.sort()) {
  const name = file.slice(0, -5);
  const source = fileURLToPath(new URL(file, folder));
  const { width, height } = await sharp(source).metadata();
  const widths = [480, 960, 1440].filter(size => size < width);
  for (const size of widths) {
    await sharp(source).resize({ width: size }).webp({ quality: name.startsWith('gallery-') ? 90 : 85 }).toFile(fileURLToPath(new URL(`${name}-${size}w.webp`, folder)));
  }
  manifest[name] = { width, height, widths: [...widths, width] };
}
await writeFile(new URL('../src/image-manifest.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared responsive images for ${sources.length} screenshots.`);
