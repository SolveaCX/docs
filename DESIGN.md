# Design

## Source of truth

- Status: Active
- Last refreshed: 2026-07-16
- Primary product surfaces: Flatkey Mintlify 文档站的英文、简体中文、指南、控制台说明和 API 参考页面。
- Evidence reviewed: `docs.json`、现有 56 个 MDX 页面、`logo/` 与 `favicon.svg`、正式站 `https://docs.flatkey.ai`、参考页 `https://flatkey.ai/docs.html#qs`、Mintlify 官方主题/字体/外观/自定义 CSS 文档。

## Brand

- Personality: 精确、克制、面向开发者，具有轻微的终端与像素工具感。
- Trust signals: 清晰的层级、高可读代码、稳定导航、明确的 API 路径、低噪声组件和一致的中英文体验。
- Avoid: 通用 SaaS 渐变、过度圆润、过量阴影、装饰性动画、橙紫混用、改变内容结构来追求视觉相似。

## Product goals

- Goals: 让文档站与 Flatkey 官网参考页形成同一视觉体系，同时保留 Mintlify 的搜索、多语言、AI 助手、独立页面和 API 能力。
- Non-goals: 不把多页文档重做成长页面，不改写文档内容，不改变路由或发布配置，不增加自定义 JavaScript。
- Success signals: 56 个现有页面继续可访问；浅色、深色、桌面端和移动端视觉一致；用户能明显识别参考页的紫色、字体、紧凑导航和深色代码语言。

## Personas and jobs

- Primary personas: 首次接入 Flatkey 的开发者、正在配置 Codex/Claude Code 的工程师、查询 API 契约的集成人员。
- User jobs: 快速找到接入步骤，复制正确代码，理解认证/计费/路由，并在中英文之间切换。
- Key contexts of use: 桌面端并排阅读代码与终端、移动端临时查询、浅色或深色系统主题。

## Information architecture

- Primary navigation: 保留 Documentation 与 API Reference 顶层标签，保留 English 与简体中文语言切换。
- Core routes/screens: `/`、`/quickstart`、`/guides/*`、`/api-reference/*` 以及对应 `/zh/*` 路径。
- Content hierarchy: 顶部品牌与全局动作；左侧分组导航；正文标题、说明与组件；右侧页面目录。

## Design principles

- Preserve capability: 视觉改造不能削弱搜索、语言切换、主题切换、AI 助手或 API 页面功能。
- Reference, not reconstruction: 复用参考页的视觉语言，不复制其单页信息架构。
- Dense navigation, readable content: 导航紧凑，正文保持 16px 基准字号和舒适行高。
- Stable hooks first: 全站样式只使用 Mintlify 官方配置、稳定 ID、元素选择器和数据属性。
- Tradeoffs: 接受 Mintlify 未来组件升级可能需要小幅 CSS 维护，换取在现有托管体系内实现品牌一致性。

## Visual language

- Color: 浅色背景 `#FFFFFF`，正文 `#0B0B0F`；主紫 `#5B21B6`，高亮紫 `#7C3AED`，浅紫 `#F0EBFA`；深色背景 `#0A0A10`，表面 `#12121A`，正文 `#F5F5F2`，次级文字 `#8E8E9C`；代码重点绿色 `#A7F3C8`。
- Typography: Public Sans 用于标题和正文；JetBrains Mono 用于代码、侧栏分组标签和 `DOCS` 标识。
- Spacing/layout rhythm: 64px 桌面页头，约 260px 左侧栏；侧栏分组紧凑，正文维持清晰的 8px 倍数间距节奏。
- Shape/radius/elevation: 导航选中态约 7px 圆角；卡片、提示和代码容器 12–16px 圆角；使用低对比边框，不使用明显投影。
- Motion: 仅保留 Mintlify 原生必要状态过渡，并尊重 reduced-motion；不增加装饰动画。
- Imagery/iconography: 使用紫色像素图标、小写 `flatkey` 与等宽 `DOCS` 组合；现有教程截图保持原内容与尺寸规则。

## Components

- Existing components to reuse: Mintlify navbar、language selector、sidebar、table of contents、search、assistant、callout、steps、tabs、code blocks、cards、frames 和 API components。
- New/changed components: 新的浅色/深色 Flatkey logo 与 favicon；全站品牌样式文件；`docs.json` 的颜色、字体、外观与代码块主题配置。
- Variants and states: 浅色/深色、活动/悬停/焦点、桌面/移动端、中英文和 API 页面状态。
- Token/component ownership: 品牌 token 由 `docs.json` 与单一全站 CSS 文件共同拥有；页面 MDX 不重复定义全局视觉 token。

## Accessibility

- Target standard: WCAG 2.2 AA。
- Keyboard/focus behavior: 保留 Mintlify 键盘行为，并为导航、按钮、语言选择和链接提供可见紫色焦点环。
- Contrast/readability: 正文与背景、紫色链接与背景、深色表面与次级文字满足 AA；正文不低于 16px 基准。
- Screen-reader semantics: 不用 CSS 伪内容替换有意义文本；logo 提供可访问名称。
- Reduced motion and sensory considerations: 不新增依赖动画的信息表达，尊重系统 reduced-motion。

## Responsive behavior

- Supported breakpoints/devices: Mintlify 现有桌面、平板和移动断点；重点验收 1440×900、390×844。
- Layout adaptations: 桌面保留左右导航和目录；移动端保留原生抽屉、搜索、语言与主题入口，缩小品牌标识但不改变信息架构。
- Touch/hover differences: 触摸目标至少 44px；悬停只增强颜色/边框，不作为唯一状态信息。

## Interaction states

- Loading: 保留 Mintlify 原生骨架/加载行为，避免自定义字体和样式造成可见闪烁。
- Empty: 保留组件原生空状态，使用统一文字和边框 token。
- Error: 错误提示使用高对比但不过度装饰的语义色，不能仅靠颜色表达。
- Success: 成功/提示状态保持语义色，边框和文字同时传达状态。
- Disabled: 降低强调但维持可读性，并保留禁用语义。
- Offline/slow network, if applicable: 字体配置提供系统字体回退；无自定义 JS 依赖。

## Content voice

- Tone: 简洁、直接、技术准确。
- Terminology: 延续现有中英文术语和产品名，不因视觉改造调整文案。
- Microcopy rules: 保持按钮和导航标签现状；代码、命令、API 字段和环境变量不改动。

## Implementation constraints

- Framework/styling system: Mintlify Luma；`docs.json` 原生外观配置；内容目录内的单一全站 CSS。
- Design-token constraints: 优先使用配置项；CSS 使用官方稳定 ID/元素/data 属性，不绑定生成的 Tailwind 类名。
- Performance constraints: 不增加自定义 JavaScript或第三方运行时；Google Fonts 由 Mintlify 原生加载；避免大图和布局抖动。
- Compatibility constraints: 保持 28 个英文和 28 个中文页面、现有路由、MDX 内容、搜索和发布流程不变。
- Test/screenshot expectations: Draft Preview 上进行桌面/移动、浅色/深色、中英文、普通文档/API 页的截图与功能验证；最终全路由检查无 404、无串语种、浏览器控制台无错误。

## Open questions

- 无。视觉范围、深色模式、主色和页头标识均已由用户确认。
