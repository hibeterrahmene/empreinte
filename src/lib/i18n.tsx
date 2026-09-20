import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { LangCode } from '@/types'
import { dictionaries, type MessageKey } from '@/data/i18n'

interface I18n {
  lang: LangCode
  dir: 'ltr' | 'rtl'
  setLang: (l: LangCode) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
  /** Nom traduit d'une thématique. */
  cat: (slug: string) => string
}

const Ctx = createContext<I18n | null>(null)
const STORAGE = 'lempreinte.lang'

function initialLang(): LangCode {
  try {
    const s = localStorage.getItem(STORAGE)
    if (s === 'en' || s === 'fr' || s === 'ar') return s
  } catch { /* ignore */ }
  const nav = (navigator.language || 'en').slice(0, 2)
  return nav === 'fr' || nav === 'ar' ? nav : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(initialLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  const setLang = useCallback((l: LangCode) => {
    setLangState(l)
    try { localStorage.setItem(STORAGE, l) } catch { /* ignore */ }
  }, [])

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      let s = dictionaries[lang][key] ?? dictionaries.en[key] ?? key
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
      return s
    },
    [lang],
  )

  const cat = useCallback((slug: string) => dictionaries[lang][`cat.${slug}` as MessageKey] ?? slug, [lang])

  const value = useMemo<I18n>(() => ({ lang, dir, setLang, t, cat }), [lang, dir, setLang, t, cat])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useI18n must be used inside <I18nProvider>')
  return c
}
