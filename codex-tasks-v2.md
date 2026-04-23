# AI江湖人格测试 · Codex 执行清单 v2

> 目标：把 `ai-boss-quiz-v2.html` 发布成可公网访问的中文测试站。  
> 形式参考：`leadertest.site` 的结果页信息密度 + `AIBTI` 的分享感 + `SBTI` 的纯前端可部署性。  
> 技术约束：Windows + Codex，无独立服务器。  
> 最终形态：纯静态站，代码托管在 GitHub，公网发布走 Cloudflare Pages（推荐）或 GitHub Pages（备选）。

---

## TASK-01 · 先理解当前方案，不要乱改结构

请先阅读 `ai-boss-quiz-v2.html`，确认它是一个**单文件纯前端测试站**，核心结构如下：

1. Landing 首屏：标题、人物 chips、开始测试按钮。
2. Quiz 流程：15 道单选题，点击选项后进入下一题。
3. Result 结果页：
   - 第一结果人物
   - 人物大图
   - 真实写照 / 口头禅 / 完整描述
   - 第二像 / 第三像
   - 灵魂伴侣 / 天生克星
   - 复制分享文案
4. 算法：
   - 原始分数 `scores`
   - 结果阶段做轻量平衡 `BALANCE_WEIGHTS`
   - 隐藏人物图灵通过 `shouldUnlockTuring()` 触发

要求：
- 不要先上 React / Vue / Next.js
- 不要拆成复杂工程
- 第一版就保持单文件静态站，优先把“能上线、能访问、能分享”做稳

---

## TASK-02 · 本地快速验收 HTML

请在本地直接打开 `ai-boss-quiz-v2.html`，逐项验证：

1. 首屏正常显示
2. 15 道题都能点选并跳转
3. 结果页正常渲染
4. 结果页出现“第二像 / 第三像”模块
5. 复制按钮可用
6. 手机竖屏宽度下布局不炸
7. 图片 404 时 Emoji fallback 正常显示

如果发现 bug，只做最小修复，不做美术重构。

---

## TASK-03 · 校验人物图片，不要盲信外链

当前版本使用的是外部图片 URL。请逐一验证 20 位人物的 `photo` 链接是否真的可访问。

检查方式：
1. 在浏览器逐个打开 `CHARS` 数组里的 `photo` 链接
2. 若 404 或加载异常，去以下来源替换：
   - Wikipedia Commons
   - 官方新闻页 / press photo
   - 官方人物页
3. 优先选择：
   - 清晰竖图
   - 中上半身
   - 非过度裁切

重要要求：
- 第一版允许继续用外链
- 但要在备注里写清楚：**外链图片存在失效和热链不稳定风险**
- 若有时间，第二版再考虑把图片下载到本地 `images/` 目录并改为相对路径

---

## TASK-04 · 部署方案采用“GitHub 管代码 + Cloudflare Pages 发网站”

默认采用下面这条路径：

- GitHub：保存源码、版本管理
- Cloudflare Pages：负责公网访问

原因：
- 没有服务器也能公开访问
- 每次 push 后自动部署
- 后续接自定义域名更顺手
- 比“只本地传文件”更适合持续迭代

执行步骤：

1. 新建 GitHub 仓库，建议名：`ai-boss-quiz`
2. 将 `ai-boss-quiz-v2.html` 重命名为 `index.html`
3. push 到 `main`
4. 登录 Cloudflare → Workers & Pages → Create project
5. 选择 **Connect to Git**
6. 连接 GitHub 仓库 `ai-boss-quiz`
7. 框架选择：**None / Static HTML**
8. Build command：留空
9. Build output directory：留空或 `/`
10. 完成部署，获得 `xxx.pages.dev`

如果 Codex 无法替你操作 Cloudflare 后台，请把需要人工点击的步骤单独列出来，不要假装已经部署成功。

---

## TASK-05 · GitHub Pages 作为备选，不做主路径

如果 Cloudflare Pages 走不通，再走 GitHub Pages：

1. 仓库根目录确保文件名是 `index.html`
2. GitHub 仓库 Settings → Pages
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main` / root
5. 等待发布完成

备注：
- GitHub Pages 可以公开访问
- 如果是 GitHub Free，最稳妥的方式是公开仓库
- 自定义域名也支持，但我仍建议优先 Cloudflare Pages

---

## TASK-06 · 检查并微调结果算法

当前版本已经补了两个关键修正：

1. **第二像 / 第三像** 已加入
2. **隐藏人物图灵** 不再是几乎无法触发

请做两件事：

### 6a. 验证图灵是否真的能出现

方法：
- 故意把选项答得分散一点
- 看是否能触发 `Alan Turing`

### 6b. 验证结果分布是否明显失衡

观察点：
- 是否仍然大量集中在 Sam / LeCun / Musk
- 是否几乎出不来 Zuckerberg / Reid / Mustafa / Greg

若仍失衡：
- 优先微调 `Qs` 中各选项的 `s` 分值
- 不要先重写整套算法
- 只有在明显失衡时，才调整 `BALANCE_WEIGHTS` 的指数 `0.7`

建议调参顺序：
1. 先调题目分值
2. 再调图灵触发阈值
3. 最后才动平衡权重公式

---

## TASK-07 · 分享体验补一个小增强

请在复制分享之外，再补一个很轻的提示优化：

- 桌面端：`已复制，发给朋友试试`。
- 手机端：`已复制，打开微信 / X / 飞书粘贴即可`。

要求：
- 不要接复杂社交 SDK
- 不要因为分享功能引入后端
- 保持纯前端

---

## TASK-08 · SEO 和基础信息补齐

请检查并补充这些信息：

1. `<title>`
2. `<meta name="description">`
3. Open Graph 基础字段（可选但建议）
   - `og:title`
   - `og:description`
   - `og:type`
4. favicon（可选）

注意：
- 第一版没有单独结果分享图也没关系
- 先保证网页标题和描述在微信/X/Slack 贴链接时不至于太难看

---

## TASK-09 · 把“人工操作步骤”和“代码已完成步骤”分开汇报

任务完成后，请按以下格式回报：

### 已完成代码修改
- 列出具体改了哪些点

### 已验证通过
- 列出已实际测试的内容

### 仍需人工操作
- 比如 Cloudflare 登录、绑定域名、开启 Pages

### 风险与建议
- 比如图片外链、版权、热链失效、后续 analytics 方案

不要写“应该可以”“理论上成功”这种模糊表述。做到了就说做到，没做到就说没做到。

---

## TASK-10 · 第二阶段可选增强（先不做）

以下内容先列为 backlog，不要混进第一版：

1. 本地化图片资源 `images/`
2. 结果统计（Cloudflare Workers / KV）
3. 自定义域名
4. 结果页 URL 参数化（可直接分享具体结果）
5. 题型升级为二选一 / 排序题 / 场景题混合
6. 自动生成结果卡图片

原则：**先上线，再雕花。**

