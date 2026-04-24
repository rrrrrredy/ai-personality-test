# AI人格测试

一个可直接本地打开、也可直接部署到 GitHub Pages / Cloudflare Pages 的单文件静态测试页。主题文案是：测测你是AI圈的哪位大佬？

当前版本基于 `ai-boss-quiz-v2.html` 整理为可交付目录，主入口已切到 `index.html`，并补了以下交付项：

- 本地可运行的单文件测试页
- 15 题完整答题流程
- 结果页的第一像 / 第二像 / 第三像
- 隐藏人物 Alan Turing 解锁逻辑
- 复制结果文案按钮的降级兜底
- 手机竖屏布局收口
- favicon / 基础 SEO / Open Graph
- GitHub + Cloudflare Pages 部署说明

## 目录

- `index.html`：最终部署入口
- `ai-boss-quiz-v2.html`：原始基线快照
- `favicon.svg`：站点图标
- `README.md`：项目说明
- `DEPLOY.md`：上线步骤
- `IMAGE_AUDIT.md`：人物图片审计记录
- `.nojekyll`：GitHub Pages 静态直出兜底

## 本地打开

最短路径：

1. 直接双击 `index.html`
2. 或在浏览器里打开 `index.html`

说明：

- 当前版本已经给“复制结果文案”加了非安全上下文 fallback，所以直接 `file://` 打开时也尽量可用
- 如果你想尽量模拟线上环境，建议再用任意静态服务器打开当前目录

## 本地验收

建议至少手动点这几项：

1. 首页进入测试
2. 任意做完 15 题
3. 结果页是否出现“最像 / 第二像 / 第三像”
4. 点击“复制结果文案去分享”
5. 点击“再测一次”

为了方便快速 smoke test，页面还加了仅 query 参数触发的 QA 钩子：

- 自动答题：`?answers=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0`
- 强制图片 fallback：在后面追加 `&brokenPhoto=1`
- 隐藏人物图灵示例：`?answers=4,4,0,1,3,0,1,3,3,3,1,3,4,2,0`

## 部署

### Cloudflare Pages

推荐主路径。根据 Cloudflare Pages 官方静态 HTML 文档，纯静态站可以直接连接 Git 仓库部署：

- 官方参考：
  - [Static HTML · Cloudflare Pages docs](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
  - [Custom domains · Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/custom-domains/)

仓库要求：

- 根目录存在 `index.html`
- 生产分支建议为 `main`

建议配置：

- Framework preset：`None`
- Production branch：`main`
- Build command：`exit 0`
- Build output directory：`.`

### GitHub Pages

作为备选路径。项目已包含 `.nojekyll`，更适合这种纯静态单页。

- 官方参考：
  - [GitHub Pages documentation](https://docs.github.com/pages)
  - [Configuring a custom domain for your GitHub Pages site](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)

要求：

- 根目录保留 `index.html`
- 仓库建议公开，尤其是 GitHub Free 场景

## 自定义域名

### Cloudflare Pages

- 子域名：可直接把 `CNAME` 指向 `<你的项目>.pages.dev`
- 顶级域：推荐把域名 DNS 接入 Cloudflare，再在 Pages 项目里添加自定义域名

### GitHub Pages

- 在仓库 `Settings > Pages` 填写自定义域名
- 根据域名类型补 DNS 记录
- GitHub 官方建议先验证域名，避免被占用

## 图片说明

- 当前交付版已经改成内置 SVG 卡通肖像，不依赖外链，部署后可稳定显示
- 原始外链来源仍保留在 `IMAGE_AUDIT.md` 里，方便你后续如果要替换成真人照片再继续处理
