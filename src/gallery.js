import { img, imageSource, gallerySizes, setResponsiveImage } from './images.js';
const copy = {
  en: {
    eyebrow: 'A CLOSER LOOK', title: 'Made to feel at home.',
    intro: 'A familiar Mac interface. Thoughtful details, in light and dark.',
    features: ['Break schedules', 'Working hours', 'Reminder settings', 'Break statistics'],
    descriptions: ['Choose a preset, then make your break intervals and durations your own.', 'Set the days and hours when reminders are active.', 'Adjust the style, size, and behavior of your break reminders.', 'See your break history and statistics in one place.'],
    themes: ['Light', 'Dark'], appearance: 'Screenshot appearance',
    note: 'Actual Mac app screenshots, shown in their original interface language.',
    enlarge: 'Enlarge screenshot', close: 'Close', zoom: 'Zoom in', fit: 'Fit to screen',
    pan: 'Scroll or swipe to explore the enlarged screenshot.', error: 'The screenshot could not be loaded. Select another view or try again.',
  },
  'zh-CN': {
    eyebrow: '近距离，看看细节', title: '熟悉的原生体验。',
    intro: '熟悉的 Mac 界面，浅色与深色，都用心。',
    features: ['休息方案', '工作时段', '提醒设置', '休息统计'],
    descriptions: ['从预设开始，自由调整休息间隔与时长，找到自己的节奏。', '按工作日和时间段设置提醒，休息日不打扰。', '调整提醒的样式、尺寸和行为，让每一次提醒都恰到好处。', '集中查看休息记录与统计，了解每天的休息情况。'],
    themes: ['浅色', '深色'], appearance: '截图主题',
    note: 'Mac 应用真实截图，保留原始界面语言。',
    enlarge: '放大查看', close: '关闭', zoom: '放大查看', fit: '适应屏幕',
    pan: '滑动或滚动，查看放大后的截图细节。', error: '截图暂时无法加载，请选择其他视图或重试。',
  },
};
const screenshotIds = [2, 3, 4, 8];
let selectedFeature = 0;
let selectedTheme = 'light';
let revision = 0;
let previewAnimation;

export function galleryMarkup(language) {
  const t = copy[language];
  return `<section id="gallery" class="section shell gallery-section" aria-labelledby="gallery-title">
    <div class="center-heading reveal"><p class="eyebrow">${t.eyebrow}</p><h2 id="gallery-title">${t.title}</h2><p>${t.intro}</p></div>
    <div class="gallery-card reveal">
      <div class="gallery-controls">
        <div class="gallery-features" role="group" aria-label="${t.title}">${t.features.map((label, i) => `<button data-gallery-feature="${i}" aria-pressed="${selectedFeature === i}" aria-controls="gallery-preview">${label}</button>`).join('')}</div>
        <div class="segmented gallery-themes" role="group" aria-label="${t.appearance}">${['light', 'dark'].map((theme, i) => `<button data-gallery-theme="${theme}" aria-pressed="${selectedTheme === theme}" aria-controls="gallery-preview">${t.themes[i]}</button>`).join('')}</div>
      </div>
      <p id="gallery-description" class="gallery-description" aria-live="polite">${t.descriptions[selectedFeature]}</p>
      <a id="gallery-preview" href="${imageSource(`gallery-${screenshotIds[selectedFeature]}-${selectedTheme}`)}" class="gallery-preview" data-theme="${selectedTheme}" aria-label="${t.enlarge}" aria-haspopup="dialog">
        ${img(`gallery-${screenshotIds[selectedFeature]}-${selectedTheme}`, `Tick Rest — ${t.features[selectedFeature]} · ${t.themes[selectedTheme === 'light' ? 0 : 1]}`, '', false, {id: 'gallery-image', sizes: gallerySizes})}
        <span class="gallery-enlarge">${t.enlarge} <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M10 7v6m-3-3h6"/></svg></span>
      </a>
      <p id="gallery-status" class="gallery-status" role="status"></p>
      <p class="gallery-note">${t.note}</p>
    </div>
  </section>`;
}

export function galleryDialogMarkup(language) {
  const t = copy[language];
  return `<dialog id="gallery-dialog" aria-labelledby="gallery-dialog-title">
    <div class="gallery-dialog-toolbar"><h2 id="gallery-dialog-title"></h2><div><button id="gallery-zoom" aria-pressed="false">${t.zoom}</button><button id="gallery-close" autofocus>${t.close} ×</button></div></div>
    <p class="gallery-pan-hint" id="gallery-pan-hint">${t.pan}</p>
    <div class="gallery-image-scroll" tabindex="0" role="region" aria-label="${t.enlarge}" aria-describedby="gallery-pan-hint"><img id="gallery-full-image" width="1780" height="1416" alt=""></div>
  </dialog>`;
}

export function bindGallery(language) {
  const t = copy[language];
  const preview = document.querySelector('#gallery-preview');
  const picture = document.querySelector('#gallery-image');
  const dialog = document.querySelector('#gallery-dialog');
  const fullImage = document.querySelector('#gallery-full-image');
  const scrollArea = document.querySelector('.gallery-image-scroll');
  const zoomButton = document.querySelector('#gallery-zoom');
  const status = document.querySelector('#gallery-status');
  let zoomed = false;
  const getName = () => `gallery-${screenshotIds[selectedFeature]}-${selectedTheme}`;
  const getAlt = () => `Tick Rest — ${t.features[selectedFeature]} · ${t.themes[selectedTheme === 'light' ? 0 : 1]}`;

  async function updatePicture(animate = true) {
    const currentRevision = ++revision;
    const name = getName();
    const alt = getAlt();
    document.querySelectorAll('[data-gallery-feature]').forEach(button => button.setAttribute('aria-pressed', Number(button.dataset.galleryFeature) === selectedFeature));
    document.querySelectorAll('[data-gallery-theme]').forEach(button => button.setAttribute('aria-pressed', button.dataset.galleryTheme === selectedTheme));
    document.querySelector('#gallery-description').textContent = t.descriptions[selectedFeature];
    preview.dataset.theme = selectedTheme;
    preview.setAttribute('aria-busy', 'true');
    // Decode before replacing the visible image; rapid clicks cannot show an outdated selection.
    if (animate) {
      const next = new Image();
      setResponsiveImage(next, name, gallerySizes);
      try { await next.decode(); }
      catch {
        if (currentRevision === revision) {
          preview.setAttribute('aria-busy', 'false');
          status.textContent = t.error;
        }
        return;
      }
    }
    if (currentRevision !== revision || !picture.isConnected) return;
    setResponsiveImage(picture, name, gallerySizes);
    preview.href = imageSource(name);
    picture.alt = alt;
    preview.setAttribute('aria-busy', 'false');
    status.textContent = '';
    previewAnimation?.cancel();
    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      previewAnimation = picture.animate([{ opacity: 0.45 }, { opacity: 1 }], { duration: 220 });
    }
  }

  document.querySelectorAll('[data-gallery-feature]').forEach(button => button.addEventListener('click', () => {
    selectedFeature = Number(button.dataset.galleryFeature);
    button.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    updatePicture();
  }));
  document.querySelectorAll('[data-gallery-theme]').forEach(button => button.addEventListener('click', () => {
    selectedTheme = button.dataset.galleryTheme;
    updatePicture();
  }));
  preview.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (preview.getAttribute('aria-busy') === 'true') return;
    fullImage.src = preview.href;
    fullImage.alt = picture.alt;
    document.querySelector('#gallery-dialog-title').textContent = picture.alt;
    zoomed = false;
    scrollArea.classList.remove('zoomed');
    zoomButton.setAttribute('aria-pressed', 'false');
    zoomButton.textContent = t.zoom;
    dialog.showModal();
    scrollArea.scrollTo(0, 0);
    document.body.classList.add('dialog-open');
  });
  zoomButton.addEventListener('click', () => {
    zoomed = !zoomed;
    scrollArea.classList.toggle('zoomed', zoomed);
    zoomButton.textContent = zoomed ? t.fit : t.zoom;
    zoomButton.setAttribute('aria-pressed', zoomed);
    scrollArea.scrollTo(0, 0);
  });
  document.querySelector('#gallery-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  // The server-rendered screenshot already has the right source and dimensions.
  revision++;
}
