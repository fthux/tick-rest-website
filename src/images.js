import manifest from './image-manifest.json' with { type: 'json' };
export const heroSizes = '(max-width: 700px) calc(100vw - 52px), (max-width: 1000px) calc(100vw - 84px), 920px';
export const gallerySizes = '(max-width: 700px) calc(100vw - 92px), (max-width: 1000px) calc(100vw - 190px), 890px';
const attribute = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
export const imageSource = name => `/images/${name}.webp`;
export function imageCandidates(name) {
  const data = manifest[name];
  return data.widths.map(width => `${width === data.width ? imageSource(name) : `/images/${name}-${width}w.webp`} ${width}w`).join(', ');
}
export function img(name, alt, cls = '', eager = false, options = {}) {
  const data = manifest[name];
  const sizes = options.sizes || (eager ? heroSizes : cls === 'fullscreen-screenshot' ? '(max-width: 700px) calc(100vw - 80px), (max-width: 1000px) calc(100vw - 132px), 1094px' : cls === 'window-screenshot' ? '(max-width: 700px) 65vw, 700px' : '(max-width: 700px) 85vw, 560px');
  return `<img ${options.id ? `id="${options.id}"` : ''} class="${cls}" src="${imageSource(name)}" srcset="${imageCandidates(name)}" sizes="${sizes}" width="${data.width}" height="${data.height}" alt="${attribute(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
export function setResponsiveImage(image, name, sizes) {
  const data = manifest[name];
  image.width = data.width;
  image.height = data.height;
  image.sizes = sizes;
  image.srcset = imageCandidates(name);
  image.src = imageSource(name);
}
