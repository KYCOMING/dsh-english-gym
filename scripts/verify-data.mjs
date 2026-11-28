#!/usr/bin/env node
/**
 * Structural + quality check for the built-in word-bank JSON files.
 *
 *   node scripts/verify-data.mjs
 *   node scripts/verify-data.mjs --min-coverage 95
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isCleanExample, isCleanPhonetic } from '../src/shared/text.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = path.join(ROOT, 'src/features/word/data')

const BANKS = {
  cet4: { file: 'cet4.json', count: 4535 },
  cet6: { file: 'cet6.json', count: 3990 },
  ielts: { file: 'ielts.json', count: 5238 },
  toefl: { file: 'toefl.json', count: 10357 },
}

const args = parseArgs(process.argv.slice(2))
let failed = false
let totalWords = 0
let totalExamples = 0
let totalUk = 0
let totalUs = 0
let totalErrors = 0

for (const [name, meta] of Object.entries(BANKS)) {
  const file = path.join(DATA_DIR, meta.file)
  let data
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (error) {
    report(name, `cannot read ${path.relative(ROOT, file)}: ${error.message}`)
    continue
  }
  if (!data || !Array.isArray(data.entries)) {
    report(name, 'top-level entries array is missing')
    continue
  }

  const errors = []
  const seen = new Set()
  let withExample = 0
  let withUk = 0
  let withUs = 0

  data.entries.forEach((entry, index) => {
    const at = `#${index + 1}`
    if (!entry || typeof entry !== 'object') {
      errors.push(`${at}: not an object`)
      return
    }
    const word = String(entry.word || '').trim()
    const meaning = String(entry.meaning || '').trim()
    if (!word) errors.push(`${at}: missing word`)
    if (!meaning) errors.push(`${at}: ${word || at} missing meaning`)
    if (word) {
      const key = word.toLowerCase()
      if (seen.has(key)) errors.push(`${at}: duplicate word "${word}"`)
      seen.add(key)
    }
    if (entry.uk !== undefined && entry.uk !== '') {
      if (!isCleanPhonetic(entry.uk)) errors.push(`${at}: ${word || at} has invalid uk phonetic "${entry.uk}"`)
      else withUk += 1
    }
    if (entry.us !== undefined && entry.us !== '') {
      if (!isCleanPhonetic(entry.us)) errors.push(`${at}: ${word || at} has invalid us phonetic "${entry.us}"`)
      else withUs += 1
    }
    const hasExample = Boolean(entry.example || entry.exampleZh)
    if (!hasExample) return
    if (!isCleanExample(word, entry.example, entry.exampleZh)) {
      errors.push(`${at}: ${word} has an invalid example/exampleZh pair`)
      return
    }
    withExample += 1
  })

  const total = data.entries.length
  totalWords += total
  totalExamples += withExample
  totalUk += withUk
  totalUs += withUs
  totalErrors += errors.length

  if (args.checkCounts && total !== meta.count) {
    errors.unshift(`entry count ${total} != expected ${meta.count}`)
  }

  const coverage = total ? (withExample / total) * 100 : 0
  const ukCoverage = total ? (withUk / total) * 100 : 0
  const usCoverage = total ? (withUs / total) * 100 : 0
  const line = [
    `${name.padEnd(5)} ${String(total).padStart(5)} words`,
    `${coverage.toFixed(1).padStart(5)}% examples`,
    `UK ${ukCoverage.toFixed(1).padStart(5)}%`,
    `US ${usCoverage.toFixed(1).padStart(5)}%`,
    errors.length ? `${errors.length} errors` : 'ok',
  ].join('  ')
  console.log(line)
  if (errors.length) {
    failed = true
    for (const error of errors.slice(0, 5)) console.log(`  - ${error}`)
    if (errors.length > 5) console.log(`  … ${errors.length - 5} more`)
  }
  if (coverage + 1e-9 < args.minCoverage) {
    failed = true
    console.log(`  ! coverage ${coverage.toFixed(1)}% < --min-coverage ${args.minCoverage}%`)
  }
  if (ukCoverage + 1e-9 < args.minPhoneticCoverage || usCoverage + 1e-9 < args.minPhoneticCoverage) {
    failed = true
    console.log(`  ! phonetic coverage UK ${ukCoverage.toFixed(1)}% / US ${usCoverage.toFixed(1)}% < --min-phonetic-coverage ${args.minPhoneticCoverage}%`)
  }
}

const overall = totalWords ? (totalExamples / totalWords) * 100 : 0
const overallUk = totalWords ? (totalUk / totalWords) * 100 : 0
const overallUs = totalWords ? (totalUs / totalWords) * 100 : 0
console.log(
  `total ${totalWords} words, ${totalExamples} examples (${overall.toFixed(1)}%), UK ${totalUk} (${overallUk.toFixed(1)}%), US ${totalUs} (${overallUs.toFixed(1)}%), ${totalErrors} errors`,
)
if (failed) process.exit(1)

function report(name, message) {
  failed = true
  totalErrors += 1
  console.log(`${name.padEnd(5)} ERROR: ${message}`)
}

function parseArgs(argv) {
  const out = { minCoverage: 0, minPhoneticCoverage: 0, checkCounts: true }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--min-coverage') out.minCoverage = Number(argv[++i]) || 0
    else if (arg === '--min-phonetic-coverage') out.minPhoneticCoverage = Number(argv[++i]) || 0
    else if (arg === '--no-check-counts') out.checkCounts = false
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/verify-data.mjs [--min-coverage N] [--min-phonetic-coverage N] [--no-check-counts]')
      process.exit(0)
    } else {
      console.error(`unknown argument: ${arg}`)
      process.exit(1)
    }
  }
  return out
}