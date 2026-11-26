import { joinParagraphs } from './structure.js'

const FALLBACK_PARAGRAPHS = [
  {
    gist_zh: '大模型竞赛之外，小模型正悄然进入真实产品。',
    sentences: [
      {
        en: 'For years the story of artificial intelligence was a race toward bigger models: more parameters, more data, more compute.',
        zh: '多年来，人工智能的故事一直是一场追逐更大模型的竞赛：更多参数、更多数据、更多算力。',
        chunks: [
          'For years',
          'the story of artificial intelligence',
          'was a race toward bigger models:',
          'more parameters, more data, more compute.',
        ],
        core: ['the story of artificial intelligence was a race'],
      },
      {
        en: 'That race is far from over, but a quieter trend is now shaping real products.',
        zh: '这场竞赛远未结束，但一股更低调的趋势正在塑造真实的产品。',
        chunks: ['That race is far from over,', 'but a quieter trend', 'is now shaping real products.'],
        core: ['That race is far from over', 'a quieter trend is now shaping'],
      },
      {
        en: 'Smaller, well-trained models are getting good enough for many everyday tasks, and they are far cheaper and faster to run.',
        zh: '更小但训练有素的模型已足以胜任许多日常任务，而且运行起来便宜得多、快得多。',
        chunks: [
          'Smaller, well-trained models',
          'are getting good enough',
          'for many everyday tasks,',
          'and they are far cheaper and faster to run.',
        ],
        core: ['models are getting good enough', 'they are far cheaper and faster'],
      },
    ],
  },
  {
    gist_zh: '小模型的优势：本地运行保护隐私、响应快、成本低。',
    sentences: [
      { en: 'The appeal is practical.', zh: '它的吸引力很实际。' },
      {
        en: 'A compact model can run on a laptop, inside a phone, or on a single server, which keeps private data close to the user.',
        zh: '紧凑的模型可以在笔记本电脑、手机或单台服务器上运行，让私密数据留在用户身边。',
        chunks: [
          'A compact model can run',
          'on a laptop, inside a phone, or on a single server,',
          'which keeps private data close to the user.',
        ],
        core: ['A compact model can run', 'which keeps private data'],
      },
      {
        en: 'It responds quickly, which matters for features like autocomplete and live translation.',
        zh: '它响应迅速，这对自动补全、实时翻译这类功能很重要。',
        chunks: ['It responds quickly,', 'which matters for features', 'like autocomplete and live translation.'],
        core: ['It responds quickly', 'which matters'],
      },
      {
        en: 'And because it costs less per request, companies can offer these features to millions of people without burning through their budgets.',
        zh: '而且由于每次请求成本更低，公司可以向数百万人提供这些功能，而不会迅速耗尽预算。',
        chunks: [
          'And because it costs less per request,',
          'companies can offer these features',
          'to millions of people',
          'without burning through their budgets.',
        ],
        core: ['companies can offer these features'],
      },
    ],
  },
  {
    gist_zh: '未来是大小模型协同，懂得选型的团队会胜出。',
    sentences: [
      {
        en: 'None of this means large models will disappear.',
        zh: '这一切并不意味着大模型会消失。',
        chunks: ['None of this means', 'large models will disappear.'],
        core: ['None of this means'],
      },
      {
        en: 'The most capable systems will still be used for hard reasoning, long documents, and open-ended research.',
        zh: '最强大的系统仍将用于复杂推理、长文档和开放式研究。',
        chunks: [
          'The most capable systems',
          'will still be used',
          'for hard reasoning, long documents, and open-ended research.',
        ],
        core: ['The most capable systems', 'will still be used'],
      },
      {
        en: 'But the future of AI is likely to be a mix: giant models in the cloud for the toughest problems, and small, specialised models running quietly everywhere else.',
        zh: '但 AI 的未来很可能是一种组合：云端的巨型模型处理最棘手的问题，小型专用模型则在其他各处默默运行。',
        chunks: [
          'But the future of AI',
          'is likely to be a mix:',
          'giant models in the cloud for the toughest problems,',
          'and small, specialised models running quietly everywhere else.',
        ],
        core: ['the future of AI is likely to be a mix'],
      },
      {
        en: 'The teams that win will be the ones that know which model to use, when, and why.',
        zh: '最终胜出的团队，将是那些知道该用哪个模型、何时用、为何用的团队。',
        chunks: ['The teams that win', 'will be the ones', 'that know which model to use, when, and why.'],
        core: ['The teams', 'will be the ones'],
      },
    ],
  },
]

export const FALLBACK_REPORT = {
  title: 'Why Small Models Are Having a Big Moment',
  summary_zh: '小模型正凭借更低成本和更快速度在真实产品中崛起。',
  body: joinParagraphs(FALLBACK_PARAGRAPHS),
  paragraphs: FALLBACK_PARAGRAPHS,
  questions: [
    { zh: '更小、训练良好的模型对许多日常任务来说已经足够好了。', en: 'Smaller, well-trained models are getting good enough for many everyday tasks.' },
    { zh: '紧凑的模型可以运行在笔记本电脑或手机上。', en: 'A compact model can run on a laptop or inside a phone.' },
    { zh: '未来的 AI 很可能是一种混合模式。', en: 'The future of AI is likely to be a hybrid.' },
  ],
  highlights: [
    { word: 'parameters', lemma: 'parameter', pos: 'n', zh: '参数' },
    { word: 'compact', pos: 'adj', zh: '紧凑的；小巧的' },
    { word: 'autocomplete', pos: 'n', zh: '自动补全' },
    { word: 'burning through', lemma: 'burn through', pos: 'phrase', zh: '迅速耗尽（预算等）' },
    { word: 'reasoning', pos: 'n', zh: '推理；逻辑思考' },
    { word: 'open-ended', pos: 'adj', zh: '开放式的；无固定答案的' },
    { word: 'specialised', lemma: 'specialise', pos: 'adj', zh: '专门化的；专用的' },
  ],
}
