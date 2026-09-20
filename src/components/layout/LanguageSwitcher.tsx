import { useEffect, useRef, useState } from 'react'
import { Check, Globe } from 'lucide-react'
import type { LangCode } from '@/types'
import { useI18n } from '@/lib/i18n'
import { cx } from '@/lib/utils'

const langs: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
]

export default function LanguageSwitcher({ inline, tone = 'dark' }: { inline?: boolean; tone?: 'dark' | 'light' }) {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  if (inline)
    return (
      <div role="group" aria-label={t('nav.language')} className="flex gap-2">
        {langs.map((l) => (
          <button key={l.code} type="button" lang={l.code} onClick={() => setLang(l.code)} aria-pressed={lang === l.code} className={cx('rounded border px-3.5 py-2 font-sans text-[0.9375rem] font-medium', lang === l.code ? 'border-ink bg-ink text-white' : 'border-ink/25')}>{l.label}</button>
        ))}
      </div>
    )

  return (
    <div ref={root} className="relative">
      <button type="button" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={cx('inline-flex h-10 items-center gap-1.5 rounded px-2 font-sans text-[0.8125rem] font-semibold uppercase transition-colors', tone === 'light' ? 'text-white hover:bg-white/10' : 'hover:bg-ink/5')} aria-label={`${t('nav.language')}: ${langs.find((l) => l.code === lang)?.label}`}>
        <Globe className="h-[18px] w-[18px]" aria-hidden />{lang}
      </button>
      {open && (
        <ul className="sheet-in absolute end-0 top-full z-50 mt-2 min-w-[10rem] border border-ink/15 bg-white py-1.5 text-ink">
          {langs.map((l) => (
            <li key={l.code}>
              <button type="button" lang={l.code} onClick={() => { setLang(l.code); setOpen(false) }} aria-current={lang === l.code} className="flex w-full items-center justify-between gap-6 px-4 py-2.5 text-start font-sans text-[0.9375rem] hover:bg-stone-50">
                {l.label}{lang === l.code && <Check className="h-4 w-4 text-mark-deep" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
