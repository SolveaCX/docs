# Flatkey 文档站中文本地化设计

## 目标

在不改变现有英文 URL 和发布配置的前提下，为 Flatkey Mintlify 文档站增加完整的简体中文版本与可见语言切换入口。中文站覆盖全部 28 个 MDX 页面，并为中文 Quickstart 使用重新从中文 Flatkey Console 截取的 4 张操作截图。

## 已确认范围

- 英文继续作为默认语言并保留现有根路径 `/`。
- 简体中文位于 `/zh`。
- 翻译全部 28 个 MDX 页面，包括未列入侧边栏导航的首页。
- 英文和中文都保留“文档”和“API 参考”两个顶层标签页结构。
- 增加 Mintlify 原生语言切换器，提供 `English` 与 `中文` 两个选项。
- 不增加自动翻译工作流、GitHub Actions 或第三方依赖。
- 不修改 Mintlify 项目设置、GitHub App、仓库权限或正式发布配置。

## 站点结构与路由

`docs.json` 的导航根节点改为 `navigation.languages`。每种语言拥有独立且完整的 tabs、groups、pages 与 navbar 配置：

- `language: "en"` 继续引用当前根目录下的英文页面。
- `language: "zh"` 引用 `zh/` 目录下与英文一致的文件结构。
- 英文导航标签保持现状。
- 中文导航标签、分组名称和导航栏按钮全部中文化。
- 英文 navbar 主按钮显示 `Console`，中文显示“控制台”，两者继续链接到 Flatkey Console。

Mintlify 会根据 `navigation.languages` 渲染原生语言切换入口。切换语言时，应进入当前页面的对应语言路径，例如 `/quickstart` 与 `/zh/quickstart` 互相对应。每个页面路径只出现在一种语言配置中，避免 Mintlify 官方文档所述的重复路径未定义行为。

## 内容翻译规则

- 翻译 frontmatter 中的 `title`、`description` 等用户可见元数据。
- 翻译正文、标题、表格、提示框、步骤、FAQ、图片替代文本和解释性文字。
- 保留 MDX 组件名称、组件结构和属性语法。
- 保留代码、命令、API 字段、请求路径、环境变量、模型 ID、文件路径和产品专有名词。
- 代码块内只翻译用于解释概念的自然语言注释，不改动会影响复制执行的代码。
- 中文内部链接指向对应 `/zh/...` 页面；外部链接和 API 地址保持不变。
- 中文用词保持简洁一致，关键术语采用统一译法，例如 API key 使用“API 密钥”，usage 使用“用量”，routing 使用“路由”。

## 中文截图

使用用户已登录的 Chrome 会话，通过 OpenCLI 操作 Flatkey Console：

1. 将 Console 界面切换为中文。
2. 分别打开充值、API 密钥列表、创建 API 密钥和用量日志页面。
3. 按与现有英文截图相同的任务语义重新取景。
4. 截图前隐藏、裁掉或避开 API 密钥、余额、邮箱等敏感信息。
5. 将中文截图放入 `images/quickstart/zh/`，使用与英文截图对应的文件名。
6. 仅中文 Quickstart 引用中文截图；英文 Quickstart 继续引用现有英文图片。

## 错误与缺失处理

- 若某个中文页面缺失，不把英文路径重复放入中文导航；应补齐对应中文文件，避免语言切换后出现 404 或语言串页。
- 若 Console 某一页面无法稳定显示中文，先确认语言状态和页面加载，再截图；不通过后期修改界面文字伪造中文截图。
- 若预览构建报告 MDX、导航或链接错误，先在当前功能分支修复并重新验证，不修改发布设置绕过错误。

## 验证标准

- `docs.json` 通过 JSON Schema/CLI 校验。
- 28 个英文页面和 28 个中文页面都存在，并且全部被预期的语言导航引用。
- 中文页面的 frontmatter、MDX 组件、代码块和内部链接有效。
- 中文页面不会通过站内链接串回英文；英文页面保持原行为。
- 语言切换器在桌面端和移动端可见，包含 `English` 与 `中文`。
- 从抽样页面切换语言时，进入对应内容而不是首页或 404。
- 中文导航、页面正文和用户可见元数据无明显漏译。
- 4 张中文截图清晰、无敏感信息，且只用于中文 Quickstart。
- Draft Preview 的桌面端、移动端、控制台和链接检查通过。

## 交付与发布边界

所有内容提交并推送到现有功能分支和 PR。代理不直接修改、合并或推送 `main`。PR 进入 `main` 后，正式站继续使用历史发布方式：在 Mintlify Dashboard 运行 `Manual update`，然后重新加载并验证 `docs.flatkey.ai` 的中英文内容和语言切换。

## 官方依据

- Mintlify 国际化指南：https://www.mintlify.com/docs/guides/internationalization
- Mintlify 导航配置：https://www.mintlify.com/docs/organize/navigation

这些官方资料确认了语言目录镜像、`navigation.languages`、原生语言切换、语言专属 navbar、唯一页面路径及本地化图片目录等实现方式。
