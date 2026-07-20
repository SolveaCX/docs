# Flatkey CC Switch 详细指南设计

## 目标

将 Flatkey 文档中 Claude Code、Codex CLI 和 Codex Desktop 三个页面的 CC Switch 内容，从简短步骤扩展为可独立完成配置的截图式教程。英文与简体中文页面同步更新，读者无需跳转到共享总指南，即可完成安装、供应商配置、启用、重启、验证、回退和故障排查。

参考 `https://docs.nonelinear.com/scenes/dev-tools/codex-app` 的信息密度和操作导向，但只采用其有效的教程结构，不照搬品牌内容、未经 Flatkey 验证的模型结论或供应商特有行为。

## 已确认决策

- 同时扩写 Claude Code、Codex CLI 和 Codex Desktop 三页。
- 英文与简体中文同步，六个页面保持内容对等。
- 每页保留完整的 CC Switch 教程，不新增共享总指南。
- 使用本机 CC Switch v3.17.0 采集真实操作截图。
- 英文页面使用英文界面截图，中文页面使用中文界面截图。
- 相同的 Codex 配置截图允许在 Codex CLI 与 Codex Desktop 页面复用。
- 截图使用临时文档配置，API Key 只显示占位值或掩码，不出现账号、路径或其他供应商信息。
- 保留现有手工配置路径；本次只扩写 CC Switch 路径及与其直接相关的验证和排障说明。

## 页面架构

每个页面的 CC Switch 部分采用一致的阅读顺序：

1. CC Switch 的用途、第三方产品声明和版本要求。
2. 安装 CC Switch 并进入对应客户端面板。
3. 新建名为 `Flatkey` 的自定义供应商。
4. 根据字段表填写 Base URL、API Key、协议和模型。
5. 保存并启用供应商，完全退出后重新启动客户端。
6. 在低成本、低上下文场景发送测试请求。
7. 通过 Flatkey Usage Logs 确认实际模型、token、延迟和费用。
8. 必要时切回官方供应商，并按症状排查配置。

三页可以重复必要步骤。目标是让从搜索引擎直接进入任一指南的读者都能完成操作，而不是为了减少重复而迫使读者跨页查找关键字段。

## 页面差异

### Claude Code

- 使用 CC Switch 的 **Claude Code** 面板。
- Flatkey Base URL 固定为 `https://router.flatkey.ai`，明确不得添加 `/v1`。
- API Key 使用 Flatkey 密钥格式 `sk-fk-...`。
- 说明保存、启用供应商以及完全重启 Claude Code 的必要性。
- 用最小请求验证连通性，再到 Flatkey Usage Logs 确认请求。
- 排查身份验证失败、Base URL 错误、余额不足、未启用目标供应商和重启前仍使用旧配置等问题。

### Codex CLI

- 使用 CC Switch 的 **Codex** 面板。
- Base URL 固定为 `https://router.flatkey.ai/v1`。
- 使用 OpenAI Responses 协议；Flatkey 原生支持该路径，不要求启用 CC Switch Local Routing。
- 说明模型映射或模型选择必须使用 Flatkey Model Directory 中存在的准确模型 ID。
- 保存并启用后完全关闭旧终端或 Codex 进程，再启动新的 CLI 会话。
- 使用 `codex` 发起低成本测试，并通过 Usage Logs 验证实际路由。
- 排查模型不存在、旧终端未加载配置、供应商未启用、Local Routing 被误开和请求未进入 Usage Logs 等问题。

### Codex Desktop

- 前置条件包括在 Codex Desktop 中完成至少一次官方 ChatGPT 或 Codex 登录。
- 在 CC Switch v3.17.0 中启用官方登录保留相关设置，并记录当前界面中的准确标签。
- 复用 Codex 的 Base URL、Responses 协议、API Key 和模型配置。
- 明确禁止将 Flatkey API Key 写入或覆盖 `auth.json`。
- 说明模型选择器可能只显示官方内置模型；界面中缺少自定义模型不等于第三方路由失败。
- 使用新对话和 Flatkey Usage Logs 判断实际供应商与模型，不以模型选择器文案作为唯一依据。
- 提供切回官方 Codex 供应商的步骤，同时保留官方登录。

## Token 消耗说明

三页都加入简短提醒：编码代理请求可能包含系统提示、工具定义、会话历史、文件内容和命令结果，因此输入 token 可能显著高于普通聊天。首次验证应在空目录或小目录中进行，并使用简单提示，避免在大型仓库或长会话中做连通性测试。

不照搬参考页中有关特定后台辅助模型、固定模型选择逻辑或硬编码模型目录的断言。只有能够通过 Flatkey Usage Logs、当前客户端行为或官方资料验证的事实才进入正式文档。

## 截图设计

截图存放在以下目录：

- `images/guides/cc-switch/en/`
- `images/guides/cc-switch/zh/`

计划采集的独立画面如下：

1. CC Switch 的 Claude Code 面板与新增供应商入口。
2. Claude Code 的 Flatkey 供应商字段。
3. Claude Code 供应商已保存并启用的状态。
4. CC Switch 的 Codex 面板与新增供应商入口。
5. Codex 的 Flatkey Base URL、Responses 协议和 API Key 字段。
6. Codex 的模型映射或模型选择界面。
7. Codex 供应商已保存并启用的状态。
8. Codex Desktop 官方登录保留设置。
9. Codex CLI 的最小验证场景。
10. Codex Desktop 的新对话或模型选择器说明场景。

Codex CLI 与 Codex Desktop 共用第 4–7 项配置图；各自保留独立的验证图和说明。图片文件名使用稳定的英文短横线命名，并在中英文目录中保持一一对应。

每张截图在写入仓库前执行以下检查：

- API Key 为占位值或由应用掩码完整遮挡。
- 不出现账号名称、邮箱、本地用户名、文件路径和非 Flatkey 供应商。
- 裁剪到当前步骤需要的窗口区域，避免整桌面截图。
- 中文与英文界面使用相同窗口尺寸和相近构图。
- 文字在文档正文宽度和移动端缩放后仍可辨认。
- 图片 alt 文本描述操作目的，不重复文件名。

## 内容组件

- 使用步骤化小节和编号标题表达操作顺序。
- 使用 Markdown 表格列出需要填写的字段和值。
- 使用 Mintlify `Note` 说明 CC Switch 是第三方工具和版本差异。
- 使用 `Warning` 强调 Claude Code Base URL 不含 `/v1`，以及 Codex Desktop 不得覆盖 `auth.json`。
- 使用 `Tip` 说明低成本验证和 Usage Logs 判定方法。
- 截图紧跟对应操作步骤，不集中堆放在章节末尾。
- 英文继续使用主动语态和第二人称；中文使用简洁、直接的操作句。

## 安全与事实边界

- 不将 CC Switch 描述为 Flatkey 官方产品。
- 只链接 CC Switch 官方站点和官方 GitHub 仓库。
- 不声称 Flatkey 是 CC Switch 内置预设；没有预设时统一使用 **Custom Provider**。
- 不展示或提交真实 Flatkey API Key。
- 不修改用户已有 CC Switch 供应商；截图使用临时配置并在采集后清理。
- 不要求 Codex Desktop 用户修改 `auth.json`。
- 不将“保留官方登录”解释为模型请求仍由 OpenAI 计费；实际路由以当前供应商配置和 Flatkey Usage Logs 为准。
- 客户端标签、字段和版本行为以 CC Switch v3.17.0 实际界面为准；官方资料用于交叉验证。

## 修改范围

正文文件：

- `guides/claude-code.mdx`
- `guides/codex-cli.mdx`
- `guides/codex-desktop.mdx`
- `zh/guides/claude-code.mdx`
- `zh/guides/codex-cli.mdx`
- `zh/guides/codex-desktop.mdx`

资源文件：

- `images/guides/cc-switch/en/*`
- `images/guides/cc-switch/zh/*`

流程文档：

- 本设计说明。
- 后续实施计划。

除非验证发现现有导航缺失或图片加载需要必要配置，否则不修改 `docs.json`、其他指南、全站样式或发布配置。

## 验证标准

- 六个页面都包含完整的 CC Switch 配置、验证、回退和故障排查路径。
- 英文与中文标题、字段、步骤、链接、提示框和截图数量保持对应。
- Claude Code 中所有 Flatkey Base URL 均为 `https://router.flatkey.ai`，没有 `/v1`。
- Codex CLI 与 Codex Desktop 使用 `https://router.flatkey.ai/v1` 和 Responses 协议。
- 文档不要求 Flatkey 的原生 Responses 路径启用 Local Routing。
- Codex Desktop 内容明确保留官方登录且不修改 `auth.json`。
- 所有图片路径存在，alt 文本有效，桌面与窄屏预览均清晰可读。
- 仓库扫描未发现 `sk-fk-` 后跟真实密钥内容、邮箱、本地用户名或临时截图。
- `docs.json` 可按 UTF-8 解析，修改后的 MDX 可被 Mintlify 加载，无无效组件或断链。
- 通过 CC Switch v3.17.0 实际完成保存、启用、重启和 Flatkey Usage Logs 验证。
- 最终 Git 差异只包含上述六个页面、截图资源和已批准的设计/计划文档。

## 分支与发布边界

- 从最新 `origin/main` 创建 `docs/ccswitch-expanded-guides`。
- 在该分支完成设计、实现和验证，不修改现有功能分支或本地 `main`。
- 如需创建 PR，默认目标为 `main`；代理可以推送功能分支并创建 PR，但不合并或推送 `main`。
- 正式发布继续由现有 Mintlify 与 GitHub 集成处理。

