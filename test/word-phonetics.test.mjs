import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { isCleanPhonetic, normalizePhonetic } from '../src/shared/text.js'
import { parseWordBank } from '../src/features/word/import.js'
import { createWordService } from '../src/features/word/service.js'

test('normalizePhonetic and isCleanPhonetic normalize IPA symbols and reject invalid values', () => {
  assert.equal(normalizePhonetic('  /əˈkɒmədeɪt/  '), 'əˈkɒmədeɪt')
  assert.equal(normalizePhonetic('[ˈbɛtəɹ]'), 'ˈbɛtər')
  assert.equal(normalizePhonetic("/'bɪɫdɪŋ/"), 'ˈbɪldɪŋ')
  assert.equal(normalizePhonetic('/ɡʊd:/'), 'gʊdː')
  assert.equal(normalizePhonetic('  //  '), '')

  assert.equal(isCleanPhonetic('əˈkɒmədeɪt'), true)
  assert.equal(isCleanPhonetic(''), false)
  assert.equal(isCleanPhonetic('/əˈkɒmədeɪt/'), false)
  assert.equal(isCleanPhonetic('[əˈkɒmədeɪt]'), false)
  assert.equal(isCleanPhonetic('中文音标'), false)
  assert.equal(isCleanPhonetic('abc123'), false)
  assert.equal(isCleanPhonetic('<b>ipa</b>'), false)
  assert.equal(isCleanPhonetic('a\nb'), false)
})

test('parseWordBank parses dual uk/us, Chinese headers, single phonetic column, and qwerty-learner JSON', () => {
  const csvEn = 'word,meaning,pos,uk,us\nschedule,日程,n,/ˈʃedjuːl/,/ˈskedʒuːl/\n'
  const resEn = parseWordBank(csvEn)
  assert.equal(resEn.entries.length, 1)
  assert.deepEqual(resEn.entries[0], {
    word: 'schedule',
    meaning: '日程',
    pos: 'n',
    uk: 'ˈʃedjuːl',
    us: 'ˈskedʒuːl',
    phonetic: '',
    example: '',
    exampleZh: '',
  })

  const csvZh = '单词,释义,英音,美音\nwater,水,[ˈwɔːtə],[ˈwɔːtər]\n'
  const resZh = parseWordBank(csvZh)
  assert.equal(resZh.entries.length, 1)
  assert.equal(resZh.entries[0].uk, 'ˈwɔːtə')
  assert.equal(resZh.entries[0].us, 'ˈwɔːtər')
  assert.equal(resZh.entries[0].phonetic, '')

  const csvSingle = 'word,meaning,音标\nabandon,放弃,/əˈbændən/\n'
  const resSingle = parseWordBank(csvSingle)
  assert.equal(resSingle.entries.length, 1)
  assert.equal(resSingle.entries[0].uk, '')
  assert.equal(resSingle.entries[0].us, '')
  assert.equal(resSingle.entries[0].phonetic, 'əˈbændən')

  const qwertyJson = JSON.stringify([
    { name: 'accommodate', trans: ['容纳', '提供住宿'], ukphone: "ə'kɒmədeɪt", usphone: 'əˈkɑːmədeɪt' },
  ])
  const resJson = parseWordBank(qwertyJson)
  assert.equal(resJson.entries.length, 1)
  assert.equal(resJson.entries[0].word, 'accommodate')
  assert.equal(resJson.entries[0].meaning, '容纳；提供住宿')
  assert.equal(resJson.entries[0].uk, 'əˈkɒmədeɪt')
  assert.equal(resJson.entries[0].us, 'əˈkɑːmədeɪt')
})

test('createWordService hides phonetics in nextWord and returns them in checkWord', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-word-phonetics-'))
  try {
    const svc = createWordService({ dir })

    // Built-in bank (default CET4): nextWord must not leak phonetics; checkWord returns them
    const qBuiltin = svc.nextWord({ mode: 'new' })
    assert.equal('uk' in qBuiltin, false)
    assert.equal('us' in qBuiltin, false)
    assert.equal('phonetic' in qBuiltin, false)

    const wrongRes = svc.checkWord({ id: qBuiltin.id, answer: 'zzzzzzzzzz' })
    assert.equal(wrongRes.correct, false)
    assert.ok(typeof wrongRes.uk === 'string')
    assert.ok(typeof wrongRes.us === 'string')
    assert.ok(wrongRes.uk.length > 0 || wrongRes.us.length > 0)

    // Custom bank with dual uk/us and generic single phonetic
    const imported = svc.importBank({
      name: 'Phonetic Custom Bank',
      content: [
        'word,meaning,uk,us,phonetic',
        'schedule,日程,/ˈʃedjuːl/,/ˈskedʒuːl/,',
        'alpha,阿尔法,,,/ˈælfə/',
      ].join('\n'),
    })
    assert.equal(imported.ok, true)

    const seen = new Set()
    for (let i = 0; i < 2; i += 1) {
      const q = svc.nextWord({ mode: 'new' })
      assert.equal('uk' in q, false)
      assert.equal('us' in q, false)
      assert.equal('phonetic' in q, false)

      const guess = q.letters === 8 ? 'schedule' : 'alpha'
      const res = svc.checkWord({ id: q.id, answer: guess })
      assert.equal(res.correct, true)
      seen.add(res.reference)
      if (res.reference === 'schedule') {
        assert.equal(res.uk, 'ˈʃedjuːl')
        assert.equal(res.us, 'ˈskedʒuːl')
        assert.equal(res.phonetic, '')
      } else {
        assert.equal(res.uk, '')
        assert.equal(res.us, '')
        assert.equal(res.phonetic, 'ˈælfə')
      }
    }
    assert.deepEqual([...seen].sort(), ['alpha', 'schedule'])
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('built-in word banks have clean UK/US phonetics with >= 90% coverage', () => {
  let totalWords = 0
  let totalUk = 0
  let totalUs = 0
  for (const name of ['cet4', 'cet6', 'ielts', 'toefl']) {
    const file = path.resolve('src/features/word/data', `${name}.json`)
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    assert.ok(Array.isArray(data.entries) && data.entries.length > 0)
    for (const entry of data.entries) {
      totalWords += 1
      if (entry.uk !== undefined) {
        assert.equal(isCleanPhonetic(entry.uk), true, `${name} ${entry.word} invalid uk: ${entry.uk}`)
        totalUk += 1
      }
      if (entry.us !== undefined) {
        assert.equal(isCleanPhonetic(entry.us), true, `${name} ${entry.word} invalid us: ${entry.us}`)
        totalUs += 1
      }
    }
  }
  assert.ok(totalUk / totalWords >= 0.9, `UK coverage ${(totalUk / totalWords).toFixed(3)} < 0.9`)
  assert.ok(totalUs / totalWords >= 0.9, `US coverage ${(totalUs / totalWords).toFixed(3)} < 0.9`)
})
