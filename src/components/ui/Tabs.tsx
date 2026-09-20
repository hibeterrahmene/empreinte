import { useRef } from 'react'
import { cx } from '@/lib/utils'

interface Props<T extends string> {
  tabs: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
  idPrefix: string
}

/** Onglets accessibles (flèches gauche/droite, Début/Fin). */
export default function Tabs<T extends string>({ tabs, value, onChange, label, idPrefix }: Props<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = document.documentElement.dir === 'rtl' ? -1 : 1
    let n = i
    if (e.key === 'ArrowRight') n = (i + dir + tabs.length) % tabs.length
    else if (e.key === 'ArrowLeft') n = (i - dir + tabs.length) % tabs.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = tabs.length - 1
    else return
    e.preventDefault()
    onChange(tabs[n].id)
    refs.current[n]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className="no-scrollbar -mb-px flex gap-6 overflow-x-auto md:gap-9">
      {tabs.map((t, i) => {
        const on = t.id === value
        return (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el }}
            role="tab"
            id={`${idPrefix}-tab-${t.id}`}
            aria-selected={on}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx('relative whitespace-nowrap border-b-[3px] py-3 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-200 rtl:tracking-normal', on ? 'border-mark text-ink' : 'border-transparent text-stone-500 hover:text-ink')}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
