import { languagePath } from './seo.js';
const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
];
let listeners;

export function languagePickerMarkup(language, label) {
  return `<div class="language-picker" data-keyboard="false">
    <button id="language" class="language-trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="language-menu" aria-label="${label}: ${languages.find(item => item.code === language).label}">
      <span>${languages.find(item => item.code === language).label}</span>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div id="language-menu" class="language-menu" role="menu" aria-label="${label}" hidden>
      ${languages.map(item => `<a href="${languagePath(item.code)}" role="menuitemradio" aria-checked="${item.code === language}" data-language="${item.code}" lang="${item.code}" tabindex="-1"><span>${item.label}</span><span class="language-check" aria-hidden="true">✓</span></a>`).join('')}
    </div>
    <noscript><a class="language-fallback" href="${languagePath(language === 'en' ? 'zh-CN' : 'en')}" lang="${language === 'en' ? 'zh-CN' : 'en'}">${language === 'en' ? '简体中文' : 'English'}</a></noscript>
  </div>`;
}

export function bindLanguagePicker(onSelect) {
  listeners?.abort();
  listeners = new AbortController();
  const { signal } = listeners;
  const root = document.querySelector('.language-picker');
  const trigger = document.querySelector('#language');
  const menu = document.querySelector('#language-menu');
  const options = [...menu.querySelectorAll('[data-language]')];
  const close = (restoreFocus = false) => {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus({ preventScroll: true });
  };
  const open = (index = options.findIndex(option => option.getAttribute('aria-checked') === 'true')) => {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    options[index].focus({ preventScroll: true });
  };
  document.addEventListener('pointerdown', event => {
    root.dataset.keyboard = 'false';
    if (!root.contains(event.target)) close();
  }, { signal });
  document.addEventListener('keydown', event => {
    if (['Tab', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'].includes(event.key)) root.dataset.keyboard = 'true';
  }, { signal, capture: true });
  trigger.addEventListener('click', () => menu.hidden ? open() : close());
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open(event.key === 'ArrowDown' ? 0 : options.length - 1);
    }
  });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
    if (event.key === 'Tab' && !menu.hidden) close(true);
  });
  menu.addEventListener('keydown', event => {
    const index = options.indexOf(document.activeElement);
    if (event.key === ' ') { event.preventDefault(); options[index]?.click(); return; }
    const targets = { ArrowDown: (index + 1) % options.length, ArrowUp: (index + options.length - 1) % options.length, Home: 0, End: options.length - 1 };
    if (Object.hasOwn(targets, event.key)) {
      event.preventDefault();
      options[targets[event.key]].focus({ preventScroll: true });
    }
  });
  options.forEach(option => option.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    close();
    onSelect(option.dataset.language, root.dataset.keyboard === 'true');
  }));
  root.addEventListener('focusout', event => {
    if (root.isConnected && !root.contains(event.relatedTarget)) close();
  });
}
