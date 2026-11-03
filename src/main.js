import './style.css';
import { content } from './copy.js';
import { renderPage, previewImage, previewOptions, command } from './page.js';
import { bindLanguagePicker } from './language-picker.js';
import { bindGallery } from './gallery.js';
import { languageFromPath, languagePath, updateMetadata } from './seo.js';

let language = languageFromPath(location.pathname);
let mode = 0;
let background = 0;
let size = 0;
let preset = 0;
let observer;
let pauseTimer;
let copyTimer;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function readingPosition() {
  const candidates = [...document.querySelectorAll('main section[id], .faq-list details[id]')];
  const anchor = candidates.reduce((nearest, el) => Math.abs(el.getBoundingClientRect().top - 110) <= Math.abs(nearest.getBoundingClientRect().top - 110) ? el : nearest, candidates[0]);
  return { id: anchor.id, offset: window.scrollY - (anchor.getBoundingClientRect().top + window.scrollY) };
}
function switchLanguage(nextLanguage, { keyboard = false, push = false } = {}) {
  const position = readingPosition();
  language = nextLanguage;
  if (push) history.pushState(null, '', languagePath(language) + location.search + location.hash);
  clearTimeout(copyTimer);
  clearInterval(pauseTimer);
  document.body.classList.remove('dialog-open');
  render();
  const anchor = document.getElementById(position.id);
  if (anchor) window.scrollTo({ top: anchor.getBoundingClientRect().top + window.scrollY + position.offset, behavior: 'instant' });
  // Re-observe after restoring the reading position so visible content never flashes out.
  observeReveals();
  document.querySelector('.language-picker').dataset.keyboard = String(keyboard);
  document.querySelector('#language').focus({ preventScroll: true });
}
function observeReveals() {
  observer?.disconnect();
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('visible') && !reducedMotion.matches && el.getBoundingClientRect().top >= innerHeight) el.classList.add('pending-reveal');
    else { el.classList.remove('pending-reveal'); el.classList.add('visible'); }
  });
  observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.05 });
  document.querySelectorAll('.pending-reveal:not(.visible)').forEach(el => observer.observe(el));
}
function render({ initial = false } = {}) {
  const faqOpen = [...document.querySelectorAll('.faq-list details')].flatMap((el, i) => el.open ? [i] : []);
  if (!initial || !document.querySelector('#app main')) document.querySelector('#app').innerHTML = renderPage(language, { mode, background, size, preset, faqOpen });
  updateMetadata(language);
  bindEvents();
  bindGallery(language);
  document.documentElement.classList.replace('no-js', 'js');
  observeReveals();
  updateParallax();
}
function updatePreview() {
  const t = content[language];
  const stage = document.querySelector('#preview-stage');
  stage.classList.toggle('window-mode', Boolean(mode));
  stage.innerHTML = previewImage(language, mode, background, size);
  document.querySelector('#mode-title').textContent = t.modeTitle[mode];
  document.querySelector('#mode-text').textContent = t.modeText[mode];
  document.querySelectorAll('[data-mode]').forEach(el => el.setAttribute('aria-pressed', Number(el.dataset.mode) === mode));
  document.querySelector('#preview-options').innerHTML = previewOptions(language, mode, background, size);
}
function bindEvents() {
 bindLanguagePicker((selectedLanguage, keyboard) => switchLanguage(selectedLanguage, { keyboard, push: true }));
 document.querySelectorAll('[data-mode]').forEach(el=>el.addEventListener('click',()=>{mode=Number(el.dataset.mode);updatePreview();}));
 document.querySelector('#preview-options').addEventListener('click',event=>{const b=event.target.closest('[data-preview]');if(!b)return;const selected=Number(b.dataset.preview);if(mode)size=selected;else background=selected;updatePreview();document.querySelector(`[data-preview="${selected}"]`).focus({preventScroll:true});});
 document.querySelectorAll('[data-preset]').forEach(el=>el.addEventListener('click',()=>{const selected=Number(el.dataset.preset);preset=selected;document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',b===el));document.querySelector('#preset-time').textContent=[20,50,25][selected];document.querySelector('#preset-detail').textContent=content[language].presetDetails[selected];}));
 document.querySelector('#copy-command').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(command);document.querySelector('#copy-status').textContent=content[language].copied;}
  catch{document.querySelector('#copy-status').textContent=content[language].copyFailed;const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(document.querySelector('#brew-command'));selection.removeAllRanges();selection.addRange(range);}
  clearTimeout(copyTimer);copyTimer=setTimeout(()=>document.querySelector('#copy-status').textContent='',4000);
 });
 const dialog=document.querySelector('#pause-dialog');
 document.querySelector('#start-pause').addEventListener('click',()=>{
  const t=content[language];let remaining=20;const end=Date.now()+20000;
  document.querySelector('#pause-title').textContent=t.breathe;document.querySelector('#pause-description').textContent=t.breatheSub;document.querySelector('#pause-count').textContent='00:20';document.querySelector('#pause-announcement').textContent='';
  dialog.classList.remove('complete');dialog.showModal();document.body.classList.add('dialog-open');
  clearInterval(pauseTimer);pauseTimer=setInterval(()=>{remaining=Math.max(0,Math.ceil((end-Date.now())/1000));document.querySelector('#pause-count').textContent=`00:${String(remaining).padStart(2,'0')}`;if(!remaining){clearInterval(pauseTimer);dialog.classList.add('complete');document.querySelector('#pause-title').textContent=t.breatheDone;document.querySelector('#pause-description').textContent=t.breatheEnd;document.querySelector('#pause-announcement').textContent=t.breatheDone;}},250);
 });
 document.querySelector('#close-pause').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{clearInterval(pauseTimer);document.body.classList.remove('dialog-open');});
}
window.addEventListener('popstate', () => {
  const nextLanguage = languageFromPath(location.pathname);
  if (nextLanguage !== language) switchLanguage(nextLanguage);
});
let scrollScheduled=false;
function updateParallax(){
 scrollScheduled=false;
 document.querySelectorAll('[data-parallax]').forEach(el=>{if(reducedMotion.matches||innerWidth<700){el.style.removeProperty('transform');return;}const r=el.getBoundingClientRect();const offset=(innerHeight/2-(r.top+r.height/2))*Number(el.dataset.parallax);el.style.transform=`translate3d(0,${Math.max(-45,Math.min(45,offset))}px,0)`;});
 document.querySelector('.header')?.classList.toggle('scrolled',scrollY>10);
}
window.addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateParallax);}},{passive:true});
window.addEventListener('resize',updateParallax);
reducedMotion.addEventListener('change',updateParallax);
render({ initial: true });
