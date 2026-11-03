import { content } from './copy.js';
import { img } from './images.js';
import { languagePickerMarkup } from './language-picker.js';
import { galleryMarkup, galleryDialogMarkup } from './gallery.js';

const repo = 'https://github.com/fthux/tick-rest-macos';
const release = `${repo}/releases/latest`;
export const command = 'brew install --cask fthux/tap/tickrest';
const icons = {
  play: '<path d="m8 4 12 8-12 8Z"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5"/>',
  leaf: '<path d="M20 4C9 1 2 6 5 14c3 8 15 5 15-10Z M5 20l10-10M9 15v-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  apple: '<path fill="currentColor" stroke="none" d="M17.1 12.5c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3.1-1.6-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.8-2.6-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.2 1 8.2.7 1 1.5 2 2.5 1.9 1 0 1.4-.6 2.7-.6 1.2 0 1.6.6 2.7.6s1.8-1 2.5-1.9c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2-.8-2-3.3ZM15 6.5c.6-.8 1-1.8.9-2.8-.9.1-2 .6-2.7 1.4-.6.7-1.1 1.7-1 2.7 1 .1 2.1-.5 2.8-1.3Z"/>',
  windows: '<path fill="currentColor" stroke="none" d="M3 4h8v8H3zm10 0h8v8h-8zM3 14h8v8H3zm10 0h8v8h-8z"/>',
  github: '<path d="M9 19c-4 1-4-2-5-2m10 5v-4c0-1 .1-1.5-.5-2 3-.3 6-1.5 6-6a4.7 4.7 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.3S17 3 14.5 4.6a12 12 0 0 0-6 0C6 3 4.9 3.4 4.9 3.4a4.4 4.4 0 0 0-.1 3.3A4.7 4.7 0 0 0 3.5 10c0 4.5 3 5.7 6 6-.6.5-.6 1.2-.5 2v4"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
export const imageNames = ['fullscreen-wallpaper', 'fullscreen-gradient', 'fullscreen-solid-color'];
export const cardNames = ['reminder-card-normal', 'reminder-card-small', 'reminder-card-mini'];
export function previewImage(language, mode, background, size) {
 const t = content[language];
 return img(mode ? cardNames[size] : imageNames[background], mode ? `${t.modes[1]} — ${t.sizes[size]}` : `${t.modes[0]} — ${t.backgrounds[background]}`, mode ? 'window-screenshot' : 'fullscreen-screenshot');
}
export function previewOptions(language, mode, background, size) {
 const t = content[language];
 return (mode ? t.sizes : t.backgrounds).map((x,i) => `<button data-preview="${i}" aria-pressed="${i === (mode ? size : background)}">${mode ? '' : `<i class="swatch swatch-${i}"></i>`}${x}</button>`).join('');
}

export function renderPage(language, { mode = 0, background = 0, size = 0, preset = 0, faqOpen = [] } = {}) {
 const t = content[language];
 return `
 <a class="skip-link" href="#main">${t.skip}</a>
 <header class="header"><nav class="nav shell" aria-label="${language === 'en' ? 'Main navigation' : '主导航'}">
  <a class="brand" href="#" aria-label="Tick Rest"><img src="/images/app-icon.png" width="34" height="34" alt="">Tick Rest</a>
  <div class="nav-links"><a href="#experience">${t.nav[0]}</a><a href="#features">${t.nav[1]}</a><a href="${repo}" target="_blank" rel="noopener noreferrer">GitHub ${icon('arrow')}</a></div>
  <div class="nav-actions">${languagePickerMarkup(language, t.lang)}<a class="button button-small" href="#download">${t.nav[2]}</a></div>
 </nav></header>
 <main id="main" tabindex="-1">
  <section id="hero" class="hero shell">
   <h1>${t.hero}</h1><p class="hero-intro">${t.intro}</p>
   <div class="hero-actions"><a class="button" href="#download">${icon('apple')}${t.install}<span aria-hidden="true">↓</span></a><a class="text-link" href="${release}" target="_blank" rel="noopener noreferrer">${t.manual}<span aria-hidden="true">↗</span></a></div>
   <p class="requirements">${t.requirements}</p>
   <div class="hero-scene" data-parallax="0.06"><div class="scene-glow"></div><div class="screen-frame">
    <div class="screen-bar"><span class="traffic-lights"><i></i><i></i><i></i></span><span>Tick Rest</span>${icon('leaf')}</div>
    ${img('fullscreen-wallpaper', t.previewAlt, 'hero-screen', true)}
   </div><div class="floating-note">${icon('leaf')}<div><strong>${t.native}</strong><span>${t.nativeSub}</span></div></div>
   <div class="image-caption"><span>${t.preview}</span><span>${t.previewSub}</span></div></div>
   <div class="scroll-cue"><span></span>${t.scroll}</div>
  </section>
  <div class="ribbon"><div class="shell">${t.ribbon.map((x,i)=>`<span>${icon(['code','leaf','lock'][i])}${x}</span>`).join('')}</div></div>
  <section id="experience" class="section shell">
   <div class="section-heading reveal"><div><p class="eyebrow">${t.experienceLabel}</p><h2>${t.experienceTitle}</h2></div><p class="section-intro">${t.experienceText}</p></div>
   <div class="experience-card reveal"><div class="experience-top"><div><h3 id="mode-title">${t.modeTitle[mode]}</h3><p id="mode-text">${t.modeText[mode]}</p></div><div class="segmented" aria-label="${t.nav[0]}">${t.modes.map((m,i)=>`<button data-mode="${i}" aria-pressed="${mode===i}">${m}</button>`).join('')}</div></div>
    <div id="preview-stage" class="preview-stage ${mode ? 'window-mode' : ''}">${previewImage(language, mode, background, size)}</div>
    <div class="preview-bottom"><div id="preview-options" class="preview-options">${previewOptions(language, mode, background, size)}</div><span>${t.screenshotNote}</span></div>
   </div>
  </section>
  <section id="features" class="section features-section"><div class="shell"><div class="center-heading reveal"><p class="eyebrow">${t.detailsLabel}</p><h2>${t.detailsTitle}</h2><p>${t.detailsIntro}</p></div>
   <div class="bento-grid">
    <article class="feature-card rhythm-card reveal"><div class="card-icon">${icon('clock')}</div><h3>${t.rhythmTitle}</h3><p>${t.rhythmText}</p><div class="rhythm-visual"><div class="timer-dial"><div><span id="preset-time">${[20,50,25][preset]}</span><small>${t.minuteUnit}</small></div></div><div class="preset-buttons">${t.presets.map((p,i)=>`<button data-preset="${i}" aria-pressed="${i===preset}">${p}</button>`).join('')}</div><p id="preset-detail">${t.presetDetails[preset]}</p></div></article>
    <article class="feature-card menu-card reveal"><div class="card-icon">${icon('sun')}</div><h3>${t.menuTitle}</h3><p>${t.menuText}</p><div class="menu-image">${img('menu-items', language==='en'?'Tick Rest menu bar countdown and quick actions':'Tick Rest 菜单栏倒计时和快捷操作')}</div></article>
    <article class="feature-card native-card reveal"><div class="native-mark">${icon('leaf')}</div><h3>${t.nativeTitle}</h3><p>${t.nativeText}</p><span class="card-label">${t.nativeTag}</span></article>
    <article class="feature-card privacy-card reveal"><div class="privacy-mark">${icon('lock')}</div><h3>${t.privateTitle}</h3><p>${t.privateText}</p><span class="card-label">${t.privateTag}</span></article>
    <article class="feature-card adapt-card reveal"><div class="card-icon">${icon('sun')}</div><h3>${t.adaptTitle}</h3><p>${t.adaptText}</p><div class="workday" aria-hidden="true"><span>09:00</span><div>${Array.from({length:24},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><span>18:00</span></div></article>
    <article class="feature-card stats-card reveal"><div><div class="card-icon">${icon('clock')}</div><h3>${t.statsTitle}</h3><p>${t.statsText}</p></div>${img('8_light',language==='en'?'Tick Rest break statistics settings':'Tick Rest 休息统计界面')}</article>
   </div>
  </div></section>
  ${galleryMarkup(language)}
  <section id="pause" class="pause-section"><div class="pause-orbit orbit-one" data-parallax="0.12"></div><div class="pause-orbit orbit-two" data-parallax="-0.1"></div><div class="pause-content reveal"><p class="eyebrow">${t.pauseLabel}</p>${icon('leaf','pause-leaf')}<h2>${t.pauseTitle}</h2><p>${t.pauseText}</p><button class="text-link" id="start-pause">${icon('play')}${t.pauseButton}</button></div></section>
  <section id="download" class="section shell download-section"><div class="center-heading reveal"><img class="download-icon" src="/images/app-icon.png" width="80" height="80" alt=""><p class="eyebrow">${t.getLabel}</p><h2>${t.getTitle}</h2><p>${t.getIntro}</p></div>
   <div class="download-grid reveal"><article class="download-card mac-card"><div class="platform-title">${icon('apple')}<h3>macOS</h3></div><p>${t.macText}</p><small>${t.macReq} · Apple Silicon / Intel</small>
    <div class="brew"><div class="brew-heading"><h4>${t.brewLabel}</h4><span class="available">${t.recommended}</span></div>
     <ol class="install-steps">${t.installSteps.map(step=>`<li>${step}</li>`).join('')}</ol>
     <div class="command-row"><code id="brew-command">${command}</code></div>
     <button class="button copy-button" id="copy-command">${icon('copy')}${t.copy}</button><span id="copy-status" role="status"></span>
     <p class="brew-help">${t.brewHelp} <a href="https://brew.sh/" target="_blank" rel="noopener noreferrer">${t.brewHelpLink} ↗</a></p>
    </div>
    <div class="manual-install"><span>${t.manualIntro}</span><a href="${release}" target="_blank" rel="noopener noreferrer">${t.manual} ${icon('arrow')}</a></div>
   </article>
   <article class="download-card windows-card"><div class="platform-title">${icon('windows')}<h3>${t.windowsTitle}</h3></div><span class="development"><span class="status-dot"></span>${t.windowsStatus}</span><p>${t.windowsText}</p><span class="windows-note">${t.windowsNote}</span></article></div>
   <aside class="signing-note" aria-labelledby="signing-title"><h3 id="signing-title">${t.signingTitle}</h3><p>${t.signingNote}</p><p>${t.signingHelp} <a href="https://support.apple.com/${language==='en'?'en-us':'zh-cn'}/102445" target="_blank" rel="noopener noreferrer">${t.appleGuide} ↗</a></p></aside>
   <p class="open-source-note">${icon('github')}${t.free}<a href="${repo}" target="_blank" rel="noopener noreferrer">${t.source} ↗</a></p>
  </section>
  <section id="faq" class="faq-section shell"><h2 class="reveal">${t.faqTitle}</h2><div class="faq-list">${t.faqs.map(([q,a],i)=>`<details id="faq-${i}" class="reveal" ${faqOpen.includes(i) ? 'open' : ''}><summary>${q}<span>+</span></summary><div><p>${a}</p>${i===2?`<a href="https://support.apple.com/${language==='en'?'en-us':'zh-cn'}/102445" target="_blank" rel="noopener noreferrer">${t.appleGuide} ↗</a>`:''}</div></details>`).join('')}</div></section>
 </main>
 <footer class="shell"><div class="footer-top"><div><a class="brand" href="#"><img src="/images/app-icon.png" width="30" height="30" alt="">Tick Rest</a><p>${t.footer}</p></div><div class="footer-links"><a href="${repo}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${repo}/releases" target="_blank" rel="noopener noreferrer">${t.releases} ↗</a><a href="${repo}/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">AGPLv3 ↗</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Tick Rest</span><span>${t.footerNote}</span></div></footer>
 ${galleryDialogMarkup(language)}
 <dialog id="pause-dialog" aria-labelledby="pause-title"><button class="close-pause" id="close-pause">${t.close} ×</button><div class="breathing-circle">${icon('leaf')}</div><h2 id="pause-title">${t.breathe}</h2><p id="pause-description">${t.breatheSub}</p><span id="pause-count" role="timer">00:20</span><p id="pause-announcement" class="sr-only" role="status"></p></dialog>`;
}
