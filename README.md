# English Gym · DSH 英语练习挂件

> 把英语学习嵌进 DSH 的工作流，而不是再做一个英语 App。一行常驻在**输入框下方**的小挂件（`English Gym`），点它时在**浮层**里弹出一块看板——**看板是浮动的，不会把对话内容撑开/顶上去**。给你一句**中文**，你写出**英文**，立刻判对错、给参考与提示；每天再推一篇 **AI / 科技** 主题的英文小报告。**全程不做语音。**

- 🎯 **看中写英**：AI 按你的等级（默认 B1）出题，判分 + 参考译文 + 一句提示。
- 🔁 **错题复习**：答错的句子自动进复习队列，隔天再考；答对后移出。
- 🔥 **轻量统计**：连续天数、正确率、今日答题、待复习数。
- 📰 **每日报告**：到点自动生成一篇 180–240 词的英文短文（附 3 道翻译小题），打开即读。
- 🧩 **两种入口**：输入框下方的 `English Gym` 挂件（点开在浮层看板里练习）；主对话里也能用工具 `english_drill` / `english_grade`。
- 🪟 **小浮窗**：看板是很小的一块浮动层，**按住任意空白处即可拖走**（按钮/输入框/报告正文可正常点选），右下角手柄可**拖动缩放**，位置/大小会记住；弹出带轻量缩放淡入动画；`Esc` 或 ✕ 收起，**不影响对话布局**。
- 🔒 **本地优先**：进度与报告以纯 JSON 存在 `$DSH_HOME/english-gym/`，不依赖任何第三方包。

## 安装

这是一个 DSH 插件（bundle）。作者目录直接安装，装完属于整个 profile：

```bash
# 在能调用 plugin_manager 的会话里：
plugin_manager install_bundle --target /绝对路径/dsh-english-learn
```

或用 `set_plugin(enabled: true)` 重新组合使其在当前会话生效。安装后重启 DSH 也可。

## 配置

配置写在 profile 的 `cordis.patch.yml`（插件条目 `id: english-gym` 的 `config`）。可用项：

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `level` | `B1` | CEFR 难度：A2 / B1 / B2 / C1 |
| `reportHour` | `9` | 每天几点后生成当日报（本地时区，0–23） |
| `topic` | `AI and technology` | 报告与出题的主题偏好 |
| `provider` / `model` | 空 | 留空则用当前会话模型（`agentDefaultModel`），可指定别的路由 |
| `dataDir` | 空 | 留空用 `$DSH_HOME/english-gym`，可自定义存储目录 |

## 工作原理

- **宿主一半**（`index.js` + `lib/`）：用 `ctx.webServer` 在 `/api/english-gym` 下挂一组 JSON 路由；用 `ctx.llm` 出题、判分、写报告；用 `node:fs` 持久化。
- **前端一半**（`client.js`）：注册两个座位——`English Gym` 触发条放在 `conversation.composer.dock`（输入框下方，常驻）；点开后那块**看板**放在 `shell.overlay`（根作用域浮层，整层默认点击穿透、面板自己 `pointer-events:auto`），`position:fixed` 浮在输入框上方，**不参与正文布局、不会把对话撑开**。两者用同一个模块内 store 同步开关与统计。用同源 `fetch()` 调上面的路由。样式只用主题变量（`--dsw-alias-*`），明暗自动适配。

这样客户端完全不需要 `harness`/动态包沙箱，也不需要额外依赖，纯 bundle 即可。

### HTTP 路由

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| GET | `/api/english-gym/health` | 存活 + 是否有可用 LLM |
| GET | `/api/english-gym/state` | 统计摘要（连续/正确率/待复习/今日） |
| POST | `/api/english-gym/next` | 出一道题（`{mode:'new'\|'review'}`，不返回答案） |
| POST | `/api/english-gym/check` | 判分（`{id,answer}`），返回对错/分数/参考/提示 |
| GET | `/api/english-gym/report` | 今日报告（有缓存则直接给） |
| POST | `/api/english-gym/report/refresh` | 强制重新生成 |

## 开发

无构建步骤、无依赖。改完源码后，对本地目录重新 `set_plugin(enabled:true)` 即可热加载；`client.js` 的改动会经 Client HMR 推到已打开的页面。

## 发布

`npm publish`（若发布到 npm）或直接以目录形式分享；确保 `files` 已包含运行所需文件（本仓库已配置）。

## License

MIT
