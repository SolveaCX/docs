# Flatkey 文档站参考风格重构设计

## 目标

在保留现有 Mintlify 页面结构、56 个中英文页面和全部功能的前提下，让 `docs.flatkey.ai` 的全站视觉语言与 `https://flatkey.ai/docs.html#qs` 保持一致。改造覆盖浅色/深色、桌面/移动、普通文档和 API 参考页面。

## 已确认决策

- 选择“只换视觉皮肤”：不改变现有信息架构和内容组织。
- 保留深色模式，并同步设计浅色与深色 token。
- 主色完整采用参考页紫色，不保留当前橙色作为第二品牌色。
- 页头采用参考页的紫色像素图标、小写 `flatkey` 和等宽 `DOCS` 标识。
- 保留 Mintlify Luma 主题、搜索、AI 助手、语言切换、主题切换、独立路由和 API 页面。
- 不增加自定义 JavaScript，不修改生产发布配置。

## 现状与参考差异

参考页使用 Public Sans、JetBrains Mono、64px 页头、约 260px 紧凑侧栏、紫色活动状态、低对比边框、16px 圆角内容面板和始终为深色的代码区域。核心 token 包括：

- `#5B21B6` 主紫、`#7C3AED` 高亮紫、`#F0EBFA` 浅紫背景。
- `#0B0B0F` 浅色正文、`#FFFFFF` 浅色背景。
- `#0A0A10` 深色背景、`#12121A` 深色表面、`#F5F5F2` 深色正文。
- `#A7F3C8` 代码重点绿色。

当前文档站使用 Inter、橙色主色、约 224px 侧栏、较宽松的默认 Luma 间距和通用 Mintlify 文字标识。仓库没有全站自定义 CSS；`logo/` 中的 SVG 是 Starter Kit 占位资产，`docs.json` 也没有启用正式 logo 配置。

## 实现架构

### `docs.json`

使用 Mintlify 原生能力配置：

- `colors.primary`、`colors.light`、`colors.dark` 为参考紫色体系。
- `fonts` 使用 Public Sans；代码字体由全站 CSS 指定 JetBrains Mono。
- `logo.light`、`logo.dark` 指向新的 Flatkey 品牌 SVG。
- `favicon` 替换为与页头一致的紫色像素标识。
- `appearance.default` 使用 `system`，`appearance.strict` 保持 `false`。
- `styling.codeblocks` 使用始终为深色的代码主题。

导航语言、tabs、groups、pages、navbar 链接和现有内容路径不变。

### 全站 CSS

在内容根目录新增单一 CSS 文件。Mintlify 会将内容目录内的 `.css` 文件加载到每个页面，无需 `docs.json` 引用。

样式只依赖 Mintlify 官方稳定选择器：

- 页面：`#body-content`、`#content-area`、`#content`、`#header`、`#page-title`。
- 导航：`#navbar`、`nav-logo`、`nav-tabs-item`、`#topbar-cta-button`。
- 侧栏：`#sidebar-content`、`sidebar-group-header`、`#sidebar-content li[data-active]`。
- 目录：`#table-of-contents`、`toc-item[data-active]`。
- 组件：`callout`、`card`、`columns`、`code-block`、`tabs`、`step`、`frame`、API 元素选择器。
- 响应式与状态：官方 data 属性、暗色类和标准媒体查询。

不绑定 Mintlify 生成的 Tailwind 类名，不通过 DOM 脚本改写组件结构。

## 视觉规格

### 页头

- 桌面高度约 64px，白色或 `#0A0A10` 背景，底部使用低对比边框。
- 左侧为紫色像素标识、小写 `flatkey`、等宽 `DOCS`。
- 活动顶层标签使用 `#F0EBFA` / `#4C1D95`；深色模式使用紫色深表面与浅紫文字。
- Console 行动按钮在浅色模式使用近黑底白字，深色模式反转为浅底深字。
- 语言、搜索、主题和 AI 助手能力保持可见与可操作。

### 侧栏与页面目录

- 桌面侧栏目标宽度约 260px；导航文字约 13.5px，保持紧凑垂直节奏。
- 分组标题使用 10px JetBrains Mono、大写、600 字重和 1.4px 字距。
- 活动项使用浅紫底、深紫字和约 7px 圆角。
- 右侧目录保留现有结构，使用相同分组字体、次级文字和紫色活动状态。

### 正文与组件

- H1 约 40px、700 字重；正文 16px，保持易读行高。
- 正文宽度不为了视觉相似而无限扩大；在保留右侧目录时维持适合技术阅读的行长。
- Callout、Card、Frame、Steps 使用 12–16px 圆角、低对比边框和无明显阴影表面。
- 链接、焦点和当前状态使用紫色；成功、警告和错误继续使用语义色。
- 代码块在两种主题中均使用 `#0A0A10` / `#12121A` 深色表面、JetBrains Mono 和绿色重点。

### 深色模式

- 页面背景 `#0A0A10`，组件表面 `#12121A`，主要文字 `#F5F5F2`，次级文字 `#8E8E9C`。
- 边框使用半透明白色，不用纯灰硬分割。
- 紫色活动状态使用深紫表面和浅紫文字，保持 AA 对比度。

### 移动端

- 保留 Mintlify 原生移动导航抽屉、搜索、语言和主题入口。
- 缩小品牌标识与间距，不隐藏关键功能。
- 触摸目标至少 44px；正文、代码和截图不产生横向页面滚动。

## 不修改内容

- 不修改 56 个 MDX 页面的正文、frontmatter、代码块、链接或截图。
- 不修改中英文路由和导航映射。
- 不把 Quickstart 或指南重做成参考页的长页面卡片结构。
- 不修改 Mintlify/GitHub App/生产发布配置。

## 验证标准

- `docs.json` 可解析并符合 Mintlify schema 支持的字段。
- 28 个英文页面与 28 个中文页面仍全部存在，56 个正式路由无 404、无错误跳转。
- English/简体中文在对应页面之间双向切换，不串语种。
- 浅色与深色模式在刷新后保持正确，无不可读文字或错误表面颜色。
- 1440×900 桌面视图验证页头、侧栏、正文、目录和代码块；390×844 验证移动导航、语言、搜索和主题入口。
- Quickstart、Codex 桌面端、普通概念页和 API 参考页均使用统一视觉系统。
- 键盘焦点清晰，主要文本与交互状态满足 WCAG 2.2 AA。
- 浏览器控制台无错误；无自定义 JavaScript；页面加载不出现明显样式闪烁。
- Draft Preview 截图与参考页并排审阅，确认紫色、字体、密度、边框、圆角和代码表面达到设计目标。

## 分支与发布边界

- 从最新 `main` 创建 `feature/docs-reference-style`。
- 先在该分支提交实现并发布 Draft Preview。
- 用户验收 Preview 后，由代理推送功能分支并创建目标为 `main` 的 PR；用户执行最终的 `main` 合并。
- 正式发布继续使用现有 Mintlify Live Manual update 流程。

## 官方依据

- Mintlify Appearance and branding：`https://www.mintlify.com/docs/organize/settings-appearance`
- Mintlify Fonts：`https://www.mintlify.com/docs/customize/fonts`
- Mintlify Themes：`https://www.mintlify.com/docs/customize/themes`
- Mintlify Custom scripts / CSS hooks：`https://www.mintlify.com/docs/customize/custom-scripts`

这些官方资料确认了颜色、字体、logo、favicon、深浅模式、代码主题、全站 CSS 自动加载，以及 navbar/sidebar/TOC/组件稳定选择器的可用范围。
