# English Gym

DSH（DeepSeek Harness）的英语练习挂件，常驻在对话输入框下方。点击后以浮窗形式展开，不占对话区域，可拖动位置和缩放大小，按 `Esc` 收起。所有练习均为读写形式，不做语音。

## 功能

- **单词训练**：内置 CET4、英语六级、雅思、托福四套静态词库（共 24,120 词，默认 CET4）。看中文释义和词性提示按字母格拼写，纯本地判分、不消耗模型；拼错会标红对应字母并支持原地重试，拼对后按 `Enter` 直接下一题。
- **自定义词库**：支持导入自己的词表（CSV / TSV / TXT / JSON），导入前可预览解析结果与报错行号，并在单词训练顶部随时切换。
- **短语训练**：由模型按设定难度（默认 CEFR B1）和内容方向出中文句子，你写英文翻译，提交后给出评分、参考译文和简短提示。答错的句子会自动进入复习队列，答对后移出。
- **今日报告**：每天在设定时间后自动生成一篇 180–240 词的英文短文，附带 3 道翻译小题，支持手动刷新换一篇。
- **数据看板**：日历热力图按每天的学习活动量（单词数 + 句子数）由浅到深着色，下方按天汇总当天练过的单词和句子（默认显示前 10 个单词、前 5 句，可展开全部），顶部显示连续天数、累计单词、累计句子与学习天数。
- **设置与统计**：面板内可切换内容方向（12 个内置方向，也支持自定义，最多 40 个）、开关答对彩带，并展示连续天数、今日答题、正确率和待复习数。
- **对话工具与本地存储**：除浮窗面板外，主对话里也可直接调用 `english_drill` 和 `english_grade` 工具练习。进度、自定义词库与每日报告都以纯 JSON 保存在 `$DSH_HOME/english-gym/`，无第三方依赖。

## 截图

### 单词训练

![单词训练](docs/screenshots/word-training.webp)

### 短语训练

![短语训练](docs/screenshots/phrase-training.webp)

### 设置

![设置](docs/screenshots/settings.webp)

## 安装

这是一个 DSH 插件包（bundle），从本地目录直接安装即可，安装后对整个 profile 生效：

```bash
# 在支持 plugin_manager 的会话中执行：
plugin_manager install_bundle --target /绝对路径/dsh-english-gym
```

安装后可执行 `set_plugin(enabled: true)` 在当前会话生效，或直接重启 DSH。

## 配置

静态配置写在 profile 的 `cordis.patch.yml` 中（`id: english-gym` 条目的 `config` 下）：

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `level` | `B1` | CEFR 难度，支持 `A2` / `B1` / `B2` / `C1` |
| `reportHour` | `9` | 每天几点后自动生成今日报告（本地时区，0–23） |
| `topic` | `AI and technology` | 面板未指定方向时的默认内容主题 |
| `provider` / `model` | 空 | 留空默认复用当前会话模型（`agentDefaultModel`），也可单独指定 |
| `dataDir` | 空 | 留空默认存在 `$DSH_HOME/english-gym`，可自定义存储路径 |

### 看板内设置

面板右上角的「设置」页配置保存在本地 `state.json`：

- **庆祝效果**：开关答对时的彩带动画。
- **内容方向**：内置 12 个方向（AI 与技术、软件开发、数据与算法、产品与设计、职场沟通、商业与创业、科学探索、健康与生活、环境与能源、教育与学习、金融与经济、文化与旅行），也可添加自己的方向（最多 40 个，支持删除）。选中后，短语出题与今日报告都会按该方向生成。

## 自定义词库

「单词训练」页顶部的下拉菜单可切换词库。内置词库包括 CET4（4,535 词）、英语六级（3,990 词）、雅思（5,238 词）和托福（10,357 词）。点击「导入」后可拖入文件、选择文件或直接粘贴文本，确认前会显示识别条数、前 5 条样例和错误行号，导入后自动切换。

### 支持格式

推荐使用 **CSV / TSV**（UTF-8，兼容 BOM，Excel 另存为「CSV UTF-8」即可）：

```csv
word,meaning,pos,phonetic,example
abandon,放弃,v,əˈbændən,He abandoned his car.
accommodate,容纳；适应,v,əˈkɒmədeɪt,The room can accommodate six people.
```

- 必填列为 `word`（英文单词）和 `meaning`（中文释义）；`pos`（词性，如 `n` / `v` / `adj`）、`phonetic`、`example` 均为可选。
- 表头可省略（默认前两列为单词、释义），也兼容中文表头 `单词,释义,词性,音标,例句`。
- **TXT**：每行一条，`abandon<TAB>放弃` 或 `abandon 放弃`。
- **JSON**：支持 `[{"word":"abandon","meaning":"放弃","pos":"v"}]`，也兼容 `[["abandon","放弃"]]` 以及 qwerty-learner 的 `{name, trans:[...]}` 格式。
- 由于采用逐字母拼写，词条须为单个英文单词（允许包含 `-` 和 `'`）；短语或非法行会自动跳过并在预览中提示。

导入的词库按独立 JSON 文件存放在 `$DSH_HOME/english-gym/wordbanks/`，不影响内置词库。

## 实现与目录结构

插件由宿主侧与前端两部分组成，无构建步骤，也不依赖外部 npm 包：

- **宿主侧（`index.js` + `src/`）**：通过 `ctx.webServer` 挂载需鉴权的内部 JSON 接口，调用 `ctx.llm` 完成出题、判分与报告生成，使用 `node:fs` 读写本地数据。
- **前端（`client.js`）**：向 `conversation.composer.dock` 注入输入框下方的触发条，向 `shell.overlay` 挂载浮动面板，两者通过模块内状态同步开关与统计，并复用 DSH 主题变量（`--dsw-alias-*`）自动适配明暗模式。

```text
src/
  core/                 # 本地 JSON 持久化、LLM 调用封装
  shared/               # 通用纯函数（答案归一化等）
  host/                 # 插件装配、内部接口、对话工具与生命周期
  features/
    phrase/             # 短语训练：出题、判分、错题复习
    word/               # 单词训练：词库管理、导入解析
      data/             # 内置 CET4 / 六级 / 雅思 / 托福静态词库
    report/             # 每日英文报告生成与兜底
    activity/           # 数据看板：按天汇总学习记录、日历热力图数据
    settings/           # 看板设置与内容方向管理
client.js               # 前端挂件（dock 入口 + overlay 浮窗）
index.js                # DSH 插件入口
```

## 开发与发布

改完源码后，对本地目录重新执行 `set_plugin(enabled: true)` 即可热加载，`client.js` 的改动会通过 Client HMR 同步到已打开的页面。发布时可直接以目录形式分享，或使用 `npm publish`（`package.json` 的 `files` 字段已配置运行所需文件）。

## License

MIT。内置词库（`src/features/word/data/*.js`）基于 [KyleBing/english-vocabulary](https://github.com/KyleBing/english-vocabulary) 的 CET4、英语六级、雅思和托福词表（BSD-3-Clause），详见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
