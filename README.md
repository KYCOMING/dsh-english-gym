# English Gym · DSH 英语练习挂件

> 把英语学习嵌进 DSH 的工作流，而不是再做一个英语 App。一行常驻在**输入框下方**的小挂件（`English Gym`），点它时在**浮层**里弹出一块看板——**看板是浮动的，不会把对话内容撑开/顶上去**。看板里分四个标签：**单词训练**（看中文，按字母格拼出单词）、**短语训练**（给你一句中文，你写出英文）、**今日报告**（每天一篇英文小短文）、**设置**（彩带开关、内容方向）。立刻判对错、给参考与提示。**全程不做语音。**

- 🎯 **短语训练（看中写英）**：AI 按你的等级（默认 B1）出题，判分 + 参考译文 + 一句提示。
- 🔤 **单词训练（拼写）**：内置 **CET4 / 英语六级 / 雅思 / 托福** 四套静态词库，共 **24120 条词条**，看中文 + 词性提示，按下方**字母空格**逐字拼出英文单词；纯本地判分、不耗模型，字母格会标出每个字母对错。
- 🏷️ **词性提示**：单词训练的题目上方显示词性（名词 / 动词 / 形容词…），不再只看中文释义盲拼。
- 🔁 **错词重试**：答错时单词会标红，并直接给出「再试一次」按钮，可原地重拼；「下一个」也放在反馈顶部，正确答案默认隐藏、点按钮才显示。
- ⌨️ **回车继续**：单词拼写正确后直接按 Enter 进入下一个。
- 📌 **固定操作栏**：单词训练输入时「提交 / 换一个」、答完后「再试一次 / 显示答案 / 下一个」都固定在面板底部；答案区再长也不用滚动去找按钮。
- 🔘 **按钮统一**：导入、提示、选择文件、返回等按钮统一圆角、字号、边框和悬停状态。
- 🧭 **对齐修复**：词库栏、答对/答错反馈、短语训练的分数 / 参考 / 提示 / 下一题都居中对齐，报告标题与题目也居中，窄面板下自动换行。
- 🧘 **更舒展的看板排版**：看板重新排过版——训练区按「题目 / 作答 / 反馈」分层留白，反馈不再堆叠卡片；单词训练直接以中文题目开场，报告改为阅读版式。
- 📥 **自定义词库**：可导入自己的词表（专业课等），支持 **CSV / TSV / TXT / JSON**；在「单词训练」里切换当前词库，导入前有解析预览和逐行错误提示。
- 🔁 **错题复习**：答错的句子自动进复习队列，隔天再考；答对后移出。
- 🔥 **轻量统计**：连续天数、正确率、今日答题、待复习数。
- 📰 **每日报告**：到点自动生成一篇 180–240 词的英文短文（附 3 道翻译小题），打开即读。
- 🧩 **两种入口**：输入框下方的 `English Gym` 挂件（点开在浮层看板里练习）；主对话里也能用工具 `english_drill` / `english_grade`。
- 🪟 **小浮窗**：看板是很小的一块浮动层，**按住任意空白处即可拖走**（按钮/输入框/报告正文可正常点选），右下角手柄可**拖动缩放**，位置/大小会记住；弹出带轻量缩放淡入动画；`Esc` 或 ✕ 收起，**不影响对话布局**。
- 🎉 **答对庆祝**：提交按钮按下有回弹反馈；答对时彩带从看板四周喷出（遵循 `prefers-reduced-motion`，减弱动效时自动关闭），可在「设置」里关闭。
- ⚙️ **设置**：看板里的「设置」标签可开关彩带，并从 **12 个内置内容方向**（AI 与技术、软件开发、数据与算法、产品与设计、职场沟通、商业与创业、科学探索、健康与生活、环境与能源、教育与学习、金融与经济、文化与旅行）中选择生成主题；也可以添加自己的方向（最多 40 个），用于短语出题和每日报告。
- 🔒 **本地优先**：进度与报告以纯 JSON 存在 `$DSH_HOME/english-gym/`，不依赖任何第三方包。

## 安装

这是一个 DSH 插件（bundle）。作者目录直接安装，装完属于整个 profile：

```bash
# 在能调用 plugin_manager 的会话里：
plugin_manager install_bundle --target /绝对路径/dsh-english-gym
```

或用 `set_plugin(enabled: true)` 重新组合使其在当前会话生效。安装后重启 DSH 也可。

## 配置

配置写在 profile 的 `cordis.patch.yml`（插件条目 `id: english-gym` 的 `config`）。可用项：

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `level` | `B1` | CEFR 难度：A2 / B1 / B2 / C1 |
| `reportHour` | `9` | 每天几点后生成当日报（本地时区，0–23） |
| `topic` | `AI and technology` | 未在看板「设置」里选择方向时使用的主题偏好 |
| `provider` / `model` | 空 | 留空则用当前会话模型（`agentDefaultModel`），可指定别的路由 |
| `dataDir` | 空 | 留空用 `$DSH_HOME/english-gym`，可自定义存储目录 |

## 设置（看板内）

看板右上角的「设置」标签会保存到本地 `state.json`：

- **庆祝效果**：开关答对时的彩带（关闭后提交按钮仍保留回弹反馈）。
- **内容方向**：内置 12 个方向，选中一个后，短语出题和每日报告都会使用该方向；切换后下一题 / 下一篇生效。
- **自定义方向**：输入名称即可加入，最多 40 个；可单独删除。自定义方向与内置方向一起参与生成。

## 自定义词库（导入）

「单词训练」页顶部的词库下拉可以切换内置词库和导入的词库；内置 **CET4（4535 词）/ 英语六级（3990 词）/ 雅思（5238 词）/ 托福（10357 词）**，默认使用 CET4。点「导入」打开导入面板，支持拖入文件、选择文件或直接粘贴文本。导入前会显示识别条数、前 5 条预览和错误行号；导入后自动切换到新词库。

### 文件格式

首选 **CSV / TSV**（UTF-8，兼容 BOM；Excel 另存为「CSV UTF-8」即可）：

```csv
word,meaning,pos,phonetic,example
abandon,放弃,v,əˈbændən,He abandoned his car.
accommodate,容纳；适应,v,əˈkɒmədeɪt,The room can accommodate six people.
```

- 必填列：`word`（英文单词）、`meaning`（中文释义）；`pos`（词性，如 `n` / `v` / `adj`）、`phonetic`、`example` 可选。
- 表头可省略（默认前两列为单词、释义），也接受中文表头 `单词,释义,词性,音标,例句`。
- **TXT**：一行一条，`abandon<TAB>放弃` 或 `abandon 放弃`。
- **JSON**：`[{"word":"abandon","meaning":"放弃","pos":"v"}]`，也兼容 `[["abandon","放弃"]]` 和 qwerty-learner 的 `{name, trans:[...]}`。
- 单词训练按字母拼写，因此词条必须是**单个英文单词**（允许 `-` 和 `'`）；短语行会被跳过并提示。

导入的词库保存在 `$DSH_HOME/english-gym/wordbanks/`，每个词库一个 JSON 文件，不会修改内置词库。

## 工作原理

- **宿主一半**（`index.js` + `src/`）：用 `ctx.webServer` 在 `/api/english-gym` 下挂一组 JSON 路由；用 `ctx.llm` 出题、判分、写报告；用 `node:fs` 持久化。
- **前端一半**（`client.js`）：注册两个座位——`English Gym` 触发条放在 `conversation.composer.dock`（输入框下方，常驻）；点开后那块**看板**放在 `shell.overlay`（根作用域浮层，整层默认点击穿透、面板自己 `pointer-events:auto`），`position:fixed` 浮在输入框上方，**不参与正文布局、不会把对话撑开**。两者用同一个模块内 store 同步开关与统计。用同源 `fetch()` 调上面的路由。样式只用主题变量（`--dsw-alias-*`），明暗自动适配。

这样客户端完全不需要 `harness`/动态包沙箱，也不需要额外依赖，纯 bundle 即可。

### 目录结构

```
src/
  core/                 # 基础设施：JSON 持久化、LLM 调用封装
  shared/               # 跨业务共用的纯函数（答案归一化等）
  host/                 # 插件装配：HTTP 路由、tools、生命周期
  features/
    phrase/             # 短语训练：出题、判分、错题复习
    word/               # 单词训练：词库管理、导入解析
      data/             # 内置 CET4/CET6/雅思/托福静态词库
    report/             # 每日 AI/科技英文报告
client.js               # 前端挂件（composer.dock 触发条 + shell.overlay 看板）
index.js                # DSH 插件入口，只负责把 host 装进 ctx
```

### HTTP 路由

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| GET | `/api/english-gym/health` | 存活 + 是否有可用 LLM |
| GET | `/api/english-gym/state` | 统计摘要（连续/正确率/待复习/今日） |
| GET | `/api/english-gym/settings` | 读取彩带开关、当前内容方向和方向列表 |
| POST | `/api/english-gym/settings` | 保存设置（`{confetti,topicId,customTopics}`，均可选） |
| POST | `/api/english-gym/next` | 出一道题（`{mode:'new'\|'review'}`，不返回答案） |
| POST | `/api/english-gym/check` | 判分（`{id,answer}`），返回对错/分数/参考/提示 |
| GET | `/api/english-gym/wordbanks` | 词库列表（内置 + 导入）与当前启用词库 |
| POST | `/api/english-gym/wordbanks/preview` | 解析预览（`{content,filename}`），返回识别条数、样例、错误行 |
| POST | `/api/english-gym/wordbanks/import` | 导入词库（`{name,filename,content}`），成功后自动启用 |
| POST | `/api/english-gym/wordbanks/active` | 切换当前词库（`{id}`） |
| POST | `/api/english-gym/wordbanks/delete` | 删除导入词库（`{id}`；内置词库不可删） |
| POST | `/api/english-gym/word/next` | 从当前词库取一个词（返回 `{id,zh,letters,bankId,bankName}`，`letters` = 字母空格数，不返回答案） |
| POST | `/api/english-gym/word/check` | 单词拼写判分（`{id,answer}`），返回对错/正确拼写/每个字母 |
| GET | `/api/english-gym/report` | 今日报告（有缓存则直接给） |
| POST | `/api/english-gym/report/refresh` | 强制重新生成 |

## 开发

无构建步骤、无依赖。改完源码后，对本地目录重新 `set_plugin(enabled:true)` 即可热加载；`client.js` 的改动会经 Client HMR 推到已打开的页面。

## 发布

`npm publish`（若发布到 npm）或直接以目录形式分享；确保 `files` 已包含运行所需文件（本仓库已配置）。

## License

MIT。内置单词库（`src/features/word/data/*.js`）取自 [KyleBing/english-vocabulary](https://github.com/KyleBing/english-vocabulary) 的 CET4、英语六级、雅思和托福词表（BSD-3-Clause），详见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。
