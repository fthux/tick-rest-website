# Tick Rest website

Tick Rest 官方产品网站。采用 Vite + 原生 JavaScript / CSS，部署方式与 `who-arrives-website` 一致：使用 Wrangler CLI 直接上传构建结果到 Cloudflare Pages。

- 英文网站：<https://tick-rest.fthux.com/>
- 中文网站：<https://tick-rest.fthux.com/zh-CN/>
- Pages 项目：`pages-tick-rest-website`
- Pages 默认域名：<https://pages-tick-rest-website.pages.dev>
- 生产分支：`master`
- macOS 源码：<https://github.com/fthux/tick-rest-macos>
- Windows 版：开发中，网站不展示 Windows 仓库链接。

## 本地开发

需要 Node.js 20.19+ 或 22.12+（推荐当前 LTS）。

```sh
npm ci
npm run dev
```

构建及预览：

```sh
npm run build
npm run preview
```

## Cloudflare Pages 部署

```sh
npm run cf:login
npx wrangler whoami
npx wrangler pages project list
```

仅在项目尚不存在时创建：

```sh
npx wrangler pages project create pages-tick-rest-website --production-branch master
```

发布到生产环境：

```sh
npm run deploy
```

`npm run build` 会生成响应式截图、构建 JS/CSS，再输出两种语言的完整静态 HTML。`npm test` 校验静态页面、SEO、资源完整性和图片尺寸。

`npm run deploy` 会先构建，再执行 `wrangler pages deploy dist --project-name pages-tick-rest-website --branch master`。后续更新使用同一命令。

### 首次配置自定义域名

在 Cloudflare Pages 的 `pages-tick-rest-website` 项目中添加 Custom domains：`tick-rest.fthux.com`。如果 `fthux.com` 位于同一 Cloudflare 账号，可以按提示自动创建指向 `pages-tick-rest-website.pages.dev` 的 CNAME。必须先把域名关联到 Pages 项目，不能只添加 DNS 记录。

如果已有同名 DNS 记录，先核实它的用途，避免覆盖其他服务。等待域名状态为 Active 且 HTTPS 证书可用后，访问正式域名验证。

Wrangler CLI 负责构建产物部署。当前 CLI 没有 Pages 自定义域名子命令；域名关联和 DNS 配置使用 Cloudflare 控制台或 Cloudflare API 完成。

## 页面与素材

- `src/copy.js`：英文与简体中文文案。
- `src/page.js`：浏览器与构建共用的页面模板。
- `src/main.js`：交互绑定、语言切换、浏览位置和状态保留。
- `src/seo.js`：双语标题、描述、canonical、hreflang、Open Graph 和 Twitter 分享信息。
- `src/document.js`、`scripts/build-pages.mjs`：生成 `/index.html` 和 `/zh-CN/index.html`，关闭 JavaScript 仍可阅读主要内容。
- `src/images.js`、`scripts/build-images.mjs`：图片尺寸清单、srcset 与按需加载。
- `src/language-picker.js`：支持鼠标、触屏和键盘的自定义语言菜单。
- `src/gallery.js`：四组真实应用截图、浅色／深色切换与放大查看，切换功能和网页语言时保留当前主题。
- `src/style.css`：响应式布局、滚动进入动效、视差和减少动态效果支持。
- `public/images`：来自 `Downloads/hello-test` 的真实截图（压缩为 WebP）及应用图标。
- `public/og-image.png`、`public/og-image-zh-CN.png`：英文和中文社交分享图。
- `public/_headers`：静态响应安全策略和缓存配置。
- `wrangler.jsonc`：Cloudflare Pages 名称和构建目录。

功能包括提醒方式与背景切换、计划预设展示、真实界面图库（休息方案、工作时段、提醒设置、休息统计）、20 秒休息体验、Homebrew 命令复制、常见问题。图库仅使用独立浅色与深色截图，不重复展示 Mix 合成图；保留原始高清 WebP，并生成较小的响应式版本；页面根据屏幕加载适合的图片，放大查看时读取原始图。网站的交互仅用于演示，不会更改桌面应用的设置。

首屏主按钮跳转到 Homebrew 安装说明，安装区域提供步骤、命令复制和 Homebrew 官网链接。ZIP 下载作为次要入口，链接到 GitHub 最新发布页，不固定具体版本或架构。安装说明解释未加入 Apple 付费开发者计划的成本原因，以及未签名／未公证与首次打开的处理方式；不承诺 Homebrew 可以绕过 Gatekeeper。更新应用功能描述时，应以 macOS 项目 README 和实现为准。静态截图使用原始界面语言，网页语言切换不改变截图内的文字。

## 多语言路由与构建

`/` 固定为英文，`/zh-CN/` 固定为简体中文；URL 是语言来源，不受浏览器语言或旧的本地偏好覆盖。首次访问根路径默认英文。切换语言更新 URL 和分享元信息，保留当前预设、FAQ、提醒样式、图库主题及阅读位置；支持前进、后退、刷新和直接分享中文地址。无 JavaScript 时提供普通语言链接，FAQ、安装命令和真实截图仍可用。

修改原始截图后执行 `npm run build` 即可重建 `*-480w.webp`、`*-960w.webp`、`*-1440w.webp` 和 `src/image-manifest.json`。不手动编辑生成的尺寸清单。添加新截图后，需要在页面或图库中引用它。两个分享 PNG 为独立美术素材，更新文案时按需同步。

`npm run dev` 也会通过同一静态模板提供两种语言，避免开发预览与生产构建不一致。Cloudflare Pages 直接提供两份 HTML，不需要 Worker 或服务器渲染。

## 发布前检查

`public/llms.txt` 是面向 AI 阅读工具的 Markdown 项目索引，包含 H1 和官方链接；它不定义抓取或训练授权。`public/404.html` 让 Cloudflare Pages 对缺失路径返回真正的 404，避免隐式 SPA 回退把首页作为不存在的 TXT/JSON 文件返回。英文和中文首页已有独立静态文件，不依赖该回退。

404 页面通过 Cloudflare Pages 的最近目录匹配自动选择语言：`/zh-CN/` 下不存在的路径使用 `public/zh-CN/404.html`（中文），其他路径使用 `public/404.html`（英文）。标题、说明、页面语言属性和首页入口均对应当前语言，不依赖 JavaScript。修改 404 样式时同步更新这两份静态文件。部署后验证 `/zh-CN/missing-page` 和 `/missing-page` 均返回 404，且分别显示中文和英文。

本站目前没有发布 MCP、AI 代理等可调用资源，因此不声明 ARD 清单，`/.well-known/ard.json` 应返回 404。以后提供相关资源时，再按 https://agenticresourcediscovery.org/spec/ 添加清单及发现链接。部署后检查 `/llms.txt` 返回 200 文本，ARD 和任意不存在的路径返回 404，两种语言首页仍返回 200。

- `npm run build` 与 `npm test` 成功。
- `/` 与 `/zh-CN/` 的静态内容、canonical、hreflang 和社交分享语言正确，关闭 JavaScript 可阅读。
- 桌面与手机无横向溢出，英文 / 简体中文切换正常。
- 提醒样式与背景、预设切换、命令复制、FAQ 和休息倒计时可用。
- 键盘可操作，Escape 可关闭休息体验，系统减少动态效果设置生效。
- 下载、源码和 Apple 帮助链接正确，Windows 卡片无仓库或下载链接。
- Pages 默认域名与自定义域名都能通过 HTTPS 加载，图片和脚本请求成功。
