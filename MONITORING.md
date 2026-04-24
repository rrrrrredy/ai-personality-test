# 监控后台接入说明

这套监控现在由 3 部分组成：

1. `index.html` 里的前端埋点
2. `functions/api/collect.js` 和 `functions/api/stats.js`
3. `monitor/index.html` 监控后台页

注意：

- 监控功能依赖 **Cloudflare Pages Functions + D1**
- 如果你把站点只部署到 GitHub Pages，测试页仍可用，但采集接口和监控后台统计 API 不会生效

## 1. 创建 D1 数据库

推荐库名：`ai-personality-test-analytics`

可用 Cloudflare Dashboard 创建，也可用 CLI：

```bash
npx wrangler d1 create ai-personality-test-analytics
```

## 2. 初始化表结构

把 `d1/schema.sql` 里的 SQL 执行到这个 D1 数据库。

CLI 方式示例：

```bash
npx wrangler d1 execute ai-personality-test-analytics --remote --file=d1/schema.sql
```

## 3. 给 Pages 项目加绑定

在 Cloudflare Pages 后台：

1. 进入 `Workers & Pages`
2. 打开项目 `ai-personality-test`
3. 进入 `Settings > Bindings`
4. 添加一个 D1 binding
5. Variable name 填：`ANALYTICS_DB`
6. 选择刚创建的数据库

## 4. 配置后台访问 token

在 Cloudflare Pages 后台：

1. 进入 `Settings > Variables and Secrets`
2. 新增 secret
3. 名称填：`ADMIN_TOKEN`
4. 值填一段你自己生成的长随机字符串

本地开发可用 `.dev.vars`：

```bash
copy .dev.vars.example .dev.vars
```

然后把里面的 `ADMIN_TOKEN` 改掉。

## 5. 重新部署

完成 D1 绑定和 secret 后，重新部署 Pages 项目。

## 6. 打开监控页

部署完成后访问：

- `/monitor/`

首次打开会要求输入 `ADMIN_TOKEN`，浏览器会保存在本地 `localStorage`，后续可直接进入。

## 当前采集的事件

- `page_view`
- `quiz_start`
- `question_answered`
- `quiz_complete`
- `share_copy`
- `quiz_retry`

## 当前可看的数据

- PV / UV
- 开始人数
- 完成人数
- 完成率
- 分享率
- 结果人物分布
- 题目流失分布
- 来源分布
- 设备分布
- 最近完成记录

## 额外说明

- README 里的 `?answers=...` 和 `&brokenPhoto=1` QA 参数会被自动标记为 `is_qa=1`
- 监控 API 默认会把这些 QA 数据排除，不污染正式统计
- 统计是轻量实现，适合第一版监控；如果后面要更高吞吐量事件流，可以再切到 Workers Analytics Engine
