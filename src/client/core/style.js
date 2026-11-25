import { useEffect } from 'react'
import tokensCss from '../styles/tokens.css'
import shellCss from '../styles/shell.css'
import phraseCss from '../styles/phrase.css'
import reportCss from '../styles/report.css'
import wordCss from '../styles/word.css'
import settingsCss from '../styles/settings.css'
import dashboardCss from '../styles/dashboard.css'
import reducedMotionCss from '../styles/reduced-motion.css'

export const STYLE_ID = 'eg-dock-style'

export const CSS = [
  tokensCss,
  shellCss,
  phraseCss,
  reportCss,
  wordCss,
  settingsCss,
  dashboardCss,
  reducedMotionCss,
].join('\n')

export function useStyle() {
  useEffect(() => {
    const existing = document.getElementById(STYLE_ID)
    if (existing) {
      // Refresh in place so live edits / HMR updates take effect without a reload.
      if (existing.textContent !== CSS) existing.textContent = CSS
      return
    }
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = CSS
    document.head.appendChild(el)
  }, [])
}
