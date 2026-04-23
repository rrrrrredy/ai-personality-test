# 部署清单

## 0. 上线前确认

部署目录以当前根目录为准，至少包含：

- `index.html`
- `favicon.svg`
- `README.md`
- `DEPLOY.md`
- `IMAGE_AUDIT.md`
- `.nojekyll`

## 1. 推到 GitHub

如果你还没建仓库，最短路径如下：

```bash
git init
git add index.html ai-boss-quiz-v2.html favicon.svg README.md DEPLOY.md IMAGE_AUDIT.md .gitignore .nojekyll
git commit -m "ship ai boss quiz"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

仓库名建议：`ai-personality-test`

## 2. 走 Cloudflare Pages

这是推荐主路径。

### 后台配置

1. 登录 Cloudflare
2. 进入 `Workers & Pages`
3. 选择 `Create application`
4. 选择 `Pages`
5. 选择 `Import an existing Git repository`
6. 连接你的 GitHub 仓库
7. 构建配置填写：

- Framework preset：`None`
- Production branch：`main`
- Build command：`exit 0`
- Build output directory：`.`

8. 点击部署
9. 等待拿到 `xxx.pages.dev`

### 部署后检查

1. 首页是否能打开
2. 做完 15 题能否出结果
3. “复制结果文案去分享”是否能用
4. “再测一次”是否能回到首页
5. 图片加载失败时是否有 Emoji fallback

可直接拿下面两个 QA 参数做快检：

- 图灵结果页：
  - `?answers=4,4,0,1,3,0,1,3,3,3,1,3,4,2,0`
- 强制图片 fallback：
  - `?answers=4,4,0,1,3,0,1,3,3,3,1,3,4,2,0&brokenPhoto=1`

## 3. GitHub Pages 备选

如果 Cloudflare Pages 这条线暂时不走，可以直接用 GitHub Pages。

### 后台配置

1. 打开 GitHub 仓库
2. 进入 `Settings > Pages`
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main`
5. Folder 选择 `/ (root)`
6. 保存并等待发布

项目根目录已经放了 `.nojekyll`，适合这类纯静态页面。

## 4. 自定义域名

### Cloudflare Pages

- 子域名：在 Pages 项目里添加域名，然后按提示补 `CNAME`
- 顶级域名：建议把域名 zone 托管到 Cloudflare，再由 Pages 自动创建记录

### GitHub Pages

- 在 `Settings > Pages` 填自定义域名
- 按 GitHub 官方文档补 DNS
- 建议先做域名验证，再开启最终指向

## 5. 这一步仍需要你手动做

这些动作我不能替你完成：

- 登录 GitHub
- 创建远程仓库
- push 到你的账号
- 登录 Cloudflare
- 在 Pages 后台点选项目和部署配置
- 接自定义域名 / 改 DNS
