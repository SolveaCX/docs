# Seedance API 文档部署记录

- 日期：2026-07-22
- 状态：已发布
- 生产环境：https://docs.flatkey.ai
- Pull request：[SolveaCX/docs#9](https://github.com/SolveaCX/docs/pull/9)
- 生产提交：[`096caa9101c1379f35bf6abdaff83f6afc30ff93`](https://github.com/SolveaCX/docs/commit/096caa9101c1379f35bf6abdaff83f6afc30ff93)

## 目标

将 NewAPI 项目中的 Seedance 调用说明整理为符合 Flatkey 现有文档风格的中英文 API 参考，并发布到 Flatkey 文档站。

## 发布内容

新增以下页面：

- 英文：[`/api-reference/seedance-video-generation`](https://docs.flatkey.ai/api-reference/seedance-video-generation)
- 中文：[`/zh/api-reference/seedance-video-generation`](https://docs.flatkey.ai/zh/api-reference/seedance-video-generation)

文档覆盖：

- `POST /v1/videos`：创建 Seedance 视频生成任务
- `GET /v1/videos/{task_id}`：查询任务状态与进度
- `GET /v1/videos/{task_id}/content`：下载生成的视频
- Python、Node.js 和 curl 请求示例
- 文本生成视频、首尾帧、多模态参考与画质超分
- 任务状态、响应字段、常见错误和端到端轮询脚本

同时更新了：

- `docs.json` 中英文导航
- 中英文 API Reference 概览页
- API 参考样式校验测试

## 实施过程

1. 参考 NewAPI 项目中的 Seedance 调用文档，核对请求路径、参数、响应结构和任务生命周期。
2. 对照 Flatkey 线上 API Reference 的排版与措辞，编写中英文 MDX 页面。
3. 将 Seedance 页面加入中英文导航和 API 概览。
4. 运行样式校验并在本地预览中检查桌面端页面。
5. 创建 PR #9，变基到最新 `origin/main` 后合并。
6. 在 Mintlify Activity 页面触发 **Manual update**。
7. Mintlify 显示发布成功后，检查中英文生产页面。

## 验证结果

发布前验证：

- `node tests/validate-reference-style.mjs`：通过，共检查 58 个路由
- `git diff --check`：通过
- 中英文本地页面：均返回 HTTP 200
- 页面检查：标题、导航、Python/Node.js/curl 标签和代码块正常
- 布局检查：没有横向溢出或错误覆盖层
- 独立复审：没有 Critical 或 Important 问题

发布后验证：

- 英文生产页面：HTTP 200
- 中文生产页面：HTTP 200
- 中文标题：`Seedance 视频生成 — POST /v1/videos`
- 英文标题：`Seedance Video Generation — POST /v1/videos`
- 中英文页面均显示 Python、Node.js 和 curl 标签
- 页面没有横向溢出或可见错误提示
- `origin/main` 指向生产提交 `096caa9101c1379f35bf6abdaff83f6afc30ff93`

## 发布异常与处理

合并后，Mintlify 自动更新没有完成。Activity 页面显示仓库尚未安装 Mintlify GitHub App，因此 Mintlify 无法创建 GitHub Check；文档内容本身没有构建错误。

处理方式：

1. 打开 Mintlify 项目的 **Activity** 页面。
2. 点击 **Manual update**。
3. 等待本次更新状态变为 **Successful**。
4. 分别访问中英文生产页面并完成发布后检查。

在安装并正确绑定 Mintlify GitHub App 之前，后续发布仍需留意自动更新是否触发；如果没有触发，继续使用上述手动更新流程。

## 标准部署流程

后续文档变更可以沿用以下流程：

1. 从最新 `origin/main` 创建文档分支。
2. 完成 MDX、`docs.json` 和相关测试修改。
3. 运行目标测试、`git diff --check` 和本地页面检查。
4. 推送分支并创建 PR。
5. PR 通过复审后合并到 `main`。
6. 检查 Mintlify Activity：
   - 自动更新成功：继续生产验证。
   - 自动更新未触发：点击 **Manual update**。
7. 至少验证中英文 URL 的 HTTP 状态、页面标题、导航、代码标签和布局。
8. 将 PR、生产提交、验证结果及异常处理补充到对应项目日志。

## 回滚

如果上线后发现阻断性问题：

1. 在 GitHub 上创建回滚 PR，撤销引入问题的生产提交；不要改写 `main` 历史。
2. 合并回滚 PR。
3. 检查 Mintlify 自动更新；未触发时执行 **Manual update**。
4. 确认受影响的生产路由恢复正常，并在本日志下追加回滚提交与原因。

## 后续事项

- 为 `SolveaCX/docs` 安装并绑定 Mintlify GitHub App，恢复合并到 `main` 后的自动发布和 GitHub Check。
- Seedance API 行为或模型列表发生变化时，同步更新中英文页面并重新执行完整验证。
