# Seedance 参考素材小白指南设计

## 目标

为第一次调用 API 的 Flatkey 用户提供一份能直接照抄的 Seedance 参考素材指南。用户完成页面后，应能创建素材、等待素材可用、使用素材生成视频，并下载结果。

## 受众与写作原则

- 受众是没有 API 经验的 PLG 用户。
- 每一步只解释“现在做什么”和“成功后看哪里”。
- 每一步只提供一条可复制的 `curl` 命令。
- 使用 Flatkey 公开名称和公开地址，不介绍内部实现。
- 中文和英文页面保持相同步骤与示例结构。
- 保留现有详细 API Reference，给需要完整参数的开发者使用。

## 页面与导航

新增两页独立指南：

- `guides/seedance-reference-assets.mdx`：`Generate a Seedance video from a reference`
- `zh/guides/seedance-reference-assets.mdx`：`用参考素材生成 Seedance 视频`

两页分别加入英文 **Guides** 和中文 **使用指南** 导航，并在页面末尾链接现有 Seedance API Reference。

## 页面内容

页面顶部先告诉用户只需准备两样东西：

1. Flatkey API Key
2. 一个可以直接打开的公网 HTTPS 图片或视频链接

正文固定为四步：

1. 创建素材，并记下返回的素材 ID。
2. 查询素材，直到状态变成 `Active`。
3. 把素材 ID 写成 `asset://ast_...`，调用 `seedance-2.0` 创建视频。
4. 使用视频任务 ID 查询结果，并从完成响应中的地址下载视频。

图片和视频的差异只用一条短提示说明，避免展开参数说明。

## 示例规则

- API Key 使用 `YOUR_FLATKEY_API_KEY`，不放置真实凭据。
- 素材 ID 使用 `ast_xxx`，视频任务 ID 使用 `task_xxx`。
- 素材链接使用 `https://example.com/...`。
- 视频示例固定使用 `seedance-2.0`，避免让用户在多个模型间选择。
- 示例只展示完成当前步骤所需的字段。

## 明确不写的内容

页面不出现供应商名称、供应商密钥、Access Key、Secret Key、项目名、端点 ID、渠道、签名、素材组、租约、幂等、路由原理或系统架构。用户请求只需要 Flatkey API Key。

## 常见问题

页面末尾仅保留少量通俗排错提示：

- 素材链接必须能从公网直接打开并使用 HTTPS。
- 素材仍是 `Processing` 时稍后再查。
- 只有状态为 `Active` 的素材才能用于视频生成。
- 图片和视频要使用对应的示例字段。
- 无法解决时查看详细 API Reference。

## 验证与发布

- 更新导航路由数量断言，确保两页都被收录且文件存在。
- 运行仓库现有文档验证脚本和 `git diff --check`。
- 扫描变更，确认没有真实凭据、内部名称或内部配置。
- 推送分支并合并到 `main`，由 Mintlify 自动发布。
- 上线后检查中英文页面、导航链接和代码块显示。

## 完成标准

- 新用户只看这一页即可按四步完成参考素材视频生成。
- 页面没有要求用户填写任何内部或供应商配置。
- 中英文页面均可从导航访问。
- 现有详细 API Reference 保持不变。
