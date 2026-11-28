# DSH-English-Gym（英语健身房）

[![npm](https://img.shields.io/npm/v/dsh-english-gym?logo=npm&logoColor=white&color=cb3837)](https://www.npmjs.com/package/dsh-english-gym) [![GitHub](https://img.shields.io/github/stars/KYCOMING/dsh-english-gym?logo=github&logoColor=white&color=181717)](https://github.com/KYCOMING/dsh-english-gym)

dsh-english-gym（英语健身房）是常驻在 DSH对话输入框下方的英语练习挂件,让你能够在VibeCoding||VibeWorking时也能练习英语，同时这个插件**可以直接读取当前会话内容来对工作流进行针对性的出题**;也可以自由选择文章难度;同时内置CET4、CET6、雅思、托福4 种常见英语词库。

## 功能

- 🎉**会话关联**：可在设置中开启，让短语出题结合当前会话最近的对话内容（自动脱敏），句子更贴近你手头的工作流程。
- 📰**今日文章**：每天在设定时间后自动生成一篇 180–240 词的英文短文，附带 3 道翻译小题，支持手动刷新换一篇；开启词库关联后会融入当前词库的单词;同时支持点击逐句翻译，以及单句语法解析
- 🎊**词库关联**：可在设置中开启，让短语出题结合当前选择的词库，句子更适合正在学习的内容。
- 📝**单词训练**：内置 CET4、英语六级、雅思、托福四套静态词库（共 24,120 词，默认 CET4），提供**英 / 美双音标**与例句释义，接入 **FSRS-6 间隔重复记忆算法**，支持「智能 / 待复习 / 新词」模式切换、拼对后「模糊 / 记得 / 很熟」记忆体感评分、下次复习时间提示与一键「已掌握」，并在底部入口实时显示到期复习单词数。
- 📥**自定义词库**：支持在「设置 → 单词词库」中导入自己的词表（CSV / TSV / TXT / JSON），导入前可预览解析结果与报错行号，并随时切换或删除词库。
- ✍️**短语训练**：由模型按设定难度（默认 CEFR B1）和内容方向出中文句子，你写英文翻译，提交后给出评分、参考译文和简短提示。答错的句子会自动进入复习队列，答对后移出。开启「词库关联」或「会话关联」后，出题会结合当前词库与最近的会话内容。
- 📊**数据看板**：GitHub 风格学习热力图按每天的学习活动量（单词数 + 句子数）由浅到深着色，支持按近一年或年份查看；下方按天分页（每页 5 天）汇总当天练过的单词和句子（默认显示前 5 个单词、前 3 句，可展开全部），顶部显示连续天数、累计单词、累计句子与学习天数。
- ⚙️**设置与统计**：面板内可切换内容方向（12 个内置方向，也支持自定义，最多 40 个）、开关答对彩带、开关词库关联并设置重试次数、开关会话关联，并展示连续天数、今日答题、正确率和待复习数。
- 🛠️**对话工具**：除浮窗面板外，主对话里也可直接调用 `english_drill` 和 `english_grade` 工具练习。

## 界面截图

### 单词训练

![图5](https://public-osss.oss-cn-beijing.aliyuncs.com/english-gym/PixPin_2026-11-26_09-49-38.png)

### 短语训练

![图1](https://public-osss.oss-cn-beijing.aliyuncs.com/english-gym/PixPin_2026-11-26_09-46-21.png)

### 今日文章

![图4](https://public-osss.oss-cn-beijing.aliyuncs.com/english-gym/PixPin_2026-11-26_14-04-32.png)

### 设置

![图4](https://public-osss.oss-cn-beijing.aliyuncs.com/english-gym/PixPin_2026-11-26_09-47-18.png)

### 数据看板

![图3](https://public-osss.oss-cn-beijing.aliyuncs.com/english-gym/PixPin_2026-11-26_09-46-48.png)

## 安装

在 DSH 的「插件 → 发现」中搜索「英语健身房」即可安装；也可在插件页按包名 `dsh-english-gym` 添加。

- 要求：DSH `>= 0.2.0-rc.1`（已实测覆盖 0.2.0-rc.1 至 0.2.2-rc.5 全部正式渠道版本及 0.2.3-alpha.3），Node `>= 22.13.0`。
- **npm**：https://www.npmjs.com/package/dsh-english-gym
- **GitHub**：https://github.com/KYCOMING/dsh-english-gym

## 自定义词库

「设置 → 单词词库」可切换内置词库或导入自己的词表。内置 CET4（4,535 词）、英语六级（3,990 词）、雅思（5,238 词）、托福（10,357 词）。点击「导入词库」可拖入文件、选择文件或直接粘贴文本，确认前会显示识别条数、样例和错误行号，导入后自动切换，且不影响内置词库。

支持格式：

- **CSV / TSV**（推荐，UTF-8，兼容 BOM）：必填 `word`（英文单词）与 `meaning`（中文释义）；可选 `pos`（词性）、`uk` / `us` / `phonetic`（英音 / 美音 / 通用音标）、`example`（英文例句）、`exampleZh`（例句翻译）。表头可省略，也兼容中文表头。
- **TXT**：每行一条，`abandon<TAB>放弃` 或 `abandon 放弃`。
- **JSON**：支持 `[{"word":"abandon","meaning":"放弃","pos":"v","uk":"əˈbændən","us":"əˈbændən","example":"...","exampleZh":"..."}]`，也兼容二维数组以及 qwerty-learner 的 `{name, trans:[...], ukphone, usphone}` 格式。
- 由于采用逐字母拼写，词条须为单个英文单词（允许 `-` 和 `'`）；短语或非法行会自动跳过并在预览中提示。

## 设置

面板右上角的「设置」页：

- **庆祝效果**：开关答对时的彩带动画。
- **记忆调度（FSRS）**：可设置单词训练的目标记忆保留率（`85%` / `90%` / `93%` / `95%`，默认 `90%`），平衡记忆牢固度与每日复习量。
- **文章难度**：支持按 CEFR 等级（`A1`–`C2`）切换今日文章的词汇与句式难度，默认 `B1`。
- **内容方向**：内置 12 个方向（AI 与技术、软件开发、数据与算法、产品与设计、职场沟通、商业与创业、科学探索、健康与生活、环境与能源、教育与学习、金融与经济、文化与旅行），也可添加自定义方向（最多 40 个，支持删除）。选中后，短语出题与今日文章都会按该方向生成。
- **词库关联**：开启后，短语出题与今日文章会从当前词库挑一批词，按语境自然融入句子和文章。可设置 0–5 次重试：生成内容没用到词库词时自动再试，默认 1 次。
- **会话关联**：开启后，短语出题会读取当前会话最近几轮对话，自动清理代码块 / URL / 路径 / 密钥等，只保留一段脱敏的自然语言摘录作为语境，让句子更贴近你手头的工作。默认关闭。
- **数据管理**：支持按时间段（7 天前 / 30 天前 / 90 天前 / 一年前 / 全部记录）清理历史学习记录与文章缓存，并可单独选择是否重置 FSRS 记忆进度，不影响偏好设置和自定义词库。

## License

MIT。内置词库基于 [KyleBing/english-vocabulary](https://github.com/KyleBing/english-vocabulary) 的 CET4、英语六级、雅思和托福词表（BSD-3-Clause），例句与中文翻译由本项目生成，详见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
