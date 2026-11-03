export const site = 'https://tick-rest.fthux.com';
export const languagePath = language => language === 'zh-CN' ? '/zh-CN/' : '/';
export const languageFromPath = path => /^\/zh-CN(?:\/|$)/i.test(path) ? 'zh-CN' : 'en';
export const metadata = {
  en: {
    title: 'Tick Rest — A little pause. A better day.',
    description: 'A free, lightweight break reminder for Mac. Rest your eyes, stretch, and build a healthier routine. Install with Homebrew. Windows version in development.',
    locale: 'en_US', image: '/og-image.png', imageAlt: 'Tick Rest — A little pause. A better day.',
  },
  'zh-CN': {
    title: 'Tick Rest — 休息一小会，让一天更美好。',
    description: 'Tick Rest 是免费、轻量的 Mac 原生休息提醒应用，帮助你定时远眺、伸展和起身活动。推荐通过 Homebrew 安装，Windows 版正在开发中。',
    locale: 'zh_CN', image: '/og-image-zh-CN.png', imageAlt: 'Tick Rest — 休息一小会，让一天更美好。',
  },
};
export function metaMarkup(language) {
  const m = metadata[language];
  const url = site + languagePath(language);
  return `<title>${m.title}</title>
    <meta name="description" content="${m.description}">
    <link rel="canonical" href="${url}">
    <link rel="alternate" hreflang="en" href="${site}/">
    <link rel="alternate" hreflang="zh-CN" href="${site}/zh-CN/">
    <link rel="alternate" hreflang="x-default" href="${site}/">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Tick Rest">
    <meta property="og:title" content="${m.title}">
    <meta property="og:description" content="${m.description}">
    <meta property="og:url" content="${url}">
    <meta property="og:locale" content="${m.locale}">
    <meta property="og:locale:alternate" content="${metadata[language === 'en' ? 'zh-CN' : 'en'].locale}">
    <meta property="og:image" content="${site}${m.image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${m.imageAlt}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${m.title}">
    <meta name="twitter:description" content="${m.description}">
    <meta name="twitter:image" content="${site}${m.image}">
    <meta name="twitter:image:alt" content="${m.imageAlt}">`;
}
export function updateMetadata(language) {
  const m = metadata[language];
  document.documentElement.lang = language;
  document.title = m.title;
  document.querySelector('link[rel="canonical"]').href = site + languagePath(language);
  const values = {
    'meta[name="description"]': m.description,
    'meta[property="og:title"]': m.title,
    'meta[property="og:description"]': m.description,
    'meta[property="og:url"]': site + languagePath(language),
    'meta[property="og:locale"]': m.locale,
    'meta[property="og:locale:alternate"]': metadata[language === 'en' ? 'zh-CN' : 'en'].locale,
    'meta[property="og:image"]': site + m.image,
    'meta[property="og:image:alt"]': m.imageAlt,
    'meta[name="twitter:title"]': m.title,
    'meta[name="twitter:description"]': m.description,
    'meta[name="twitter:image"]': site + m.image,
    'meta[name="twitter:image:alt"]': m.imageAlt,
  };
  for (const [selector, value] of Object.entries(values)) document.querySelector(selector).content = value;
}
