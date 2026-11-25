export const POS_LABELS = {
  n: '名词', v: '动词', adj: '形容词', adv: '副词', prep: '介词', pron: '代词',
  conj: '连词', num: '数词', art: '冠词', aux: '助动词', int: '感叹词',
  phrase: '短语', idiom: '习语',
}

export function formatPos(pos) {
  const parts = String(pos || '')
    .toLowerCase()
    .split(/[\/,&\s]+/)
    .map((p) => p.replace(/\.+$/, ''))
    .filter(Boolean)
    .map((p) => (p === 'vt' || p === 'vi' ? 'v' : p))
  const unique = [...new Set(parts)]
  if (!unique.length) return ''
  return unique
    .map((p) => {
      if (p === 'phrase' || p === 'idiom') return POS_LABELS[p]
      return POS_LABELS[p] ? POS_LABELS[p] + ' ' + p + '.' : p
    })
    .join(' / ')
}

export function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function splitOutsideParens(str, seps) {
  const out = []
  let depth = 0
  let start = 0
  for (let i = 0; i < str.length; i += 1) {
    const ch = str[i]
    if (ch === '(' || ch === '（' || ch === '[' || ch === '【') depth += 1
    else if ((ch === ')' || ch === '）' || ch === ']' || ch === '】') && depth > 0) depth -= 1
    else if (depth === 0 && seps.includes(ch)) {
      out.push(str.slice(start, i))
      start = i + 1
    }
  }
  out.push(str.slice(start))
  return out
}

/** Normalize mixed ASCII/CJK punctuation and deduplicate repeated glosses for display. */
export function formatMeaning(raw) {
  const source = String(raw || '').trim()
  if (!source) return ''
  const seen = new Set()
  const groups = []
  for (const rawGroup of splitOutsideParens(source, ';；')) {
    const terms = []
    for (const rawTerm of splitOutsideParens(rawGroup, ',，、')) {
      const term = rawTerm.trim().replace(/\s+/g, ' ')
      if (!term) continue
      const key = term.toLowerCase().replace(/\s+/g, '')
      if (seen.has(key)) continue
      seen.add(key)
      terms.push(term)
    }
    if (terms.length) groups.push(terms.join('、'))
  }
  return groups.length ? groups.join('；') : source
}

/** Split a sentence around the target word for highlighting after grading. */
export function splitByWord(text, word) {
  const source = String(text || '')
  const target = String(word || '')
  if (!target) return [source]
  return source.split(new RegExp('(' + escapeRegExp(target) + ')', 'gi'))
}

/** Split a reference sentence around any matched word-bank terms (longest first). */
export function splitByTerms(text, terms) {
  const source = String(text || '')
  const clean = (Array.isArray(terms) ? terms : [])
    .map((t) => String(t || '').trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  if (!source || !clean.length) return [source]
  const pattern = clean
    .map((t) => (/\s/.test(t) ? escapeRegExp(t) : '\\b' + escapeRegExp(t) + '\\b'))
    .join('|')
  try {
    return source.split(new RegExp('(' + pattern + ')', 'gi'))
  } catch {
    return [source]
  }
}

export function normalizeEnglish(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function copyToClipboard(text) {
  const value = String(text || '')
  if (!value) return false
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    /* fall back to execCommand */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = value
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return !!ok
  } catch {
    return false
  }
}
