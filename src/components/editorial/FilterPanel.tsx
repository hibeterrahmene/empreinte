import type { ReactNode } from 'react'
import type { SearchFilters } from '@/types'
import { repo } from '@/data/repository'
import { yearOf } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { CheckboxField } from '@/components/forms/fields'
import { Chip } from '@/components/ui/Tag'

interface Props { filters: SearchFilters; onChange: (p: Partial<SearchFilters>) => void; onReset: () => void; activeCount: number }

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-ink/15 py-6 first:border-t-0 first:pt-0">
      <legend className="mb-4 float-left w-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.12em] text-stone-700 rtl:tracking-normal">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  )
}

/** Panneau de filtres combinables : thématiques, années, numéros, auteurs, plage de dates, plein texte. */
export default function FilterPanel({ filters, onChange, onReset, activeCount }: Props) {
  const { t, cat } = useI18n()
  const all = repo.articles()
  const count = (fn: (a: (typeof all)[number]) => boolean) => all.filter(fn).length
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="t-h4">{t('search.filters')}</h2>
        <button type="button" onClick={onReset} disabled={!activeCount && !filters.q} className="link font-sans text-[0.8125rem] font-semibold disabled:pointer-events-none disabled:opacity-40">{t('search.reset')}</button>
      </div>

      <Group title={t('search.scope')}>
        <CheckboxField label={t('search.fullText')} checked={filters.fullText} onChange={(e) => onChange({ fullText: e.target.checked })} />
      </Group>

      <Group title={t('nav.topics')}>
        <div className="space-y-3">
          {repo.categories().map((c) => (
            <div key={c.slug} className="flex items-center justify-between gap-3">
              <CheckboxField label={cat(c.slug)} checked={filters.topics.includes(c.slug)} onChange={() => onChange({ topics: toggle(filters.topics, c.slug) })} />
              <span className="font-sans text-[0.8125rem] tabular-nums text-stone-500">{count((a) => a.category === c.slug)}</span>
            </div>
          ))}
        </div>
      </Group>

      <Group title={t('search.year')}>
        <div className="flex flex-wrap gap-2">
          {repo.articleYears().map((y) => <Chip key={y} active={filters.years.includes(y)} onClick={() => onChange({ years: toggle(filters.years, y) })}>{y} <span className="text-stone-500">({count((a) => yearOf(a.date) === y)})</span></Chip>)}
        </div>
      </Group>

      <Group title={t('search.issue')}>
        <div className="space-y-3">
          {repo.issues().map((i) => (
            <CheckboxField key={i.slug} label={<>{t('common.issueN', { n: i.number })} <span className="text-stone-500">· {i.title}</span></>} checked={filters.issues.includes(i.slug)} onChange={() => onChange({ issues: toggle(filters.issues, i.slug) })} />
          ))}
        </div>
      </Group>

      <Group title={t('search.dates')}>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-[0.8125rem] text-stone-700">{t('search.from')}
            <input type="date" value={filters.from} max={filters.to || undefined} onChange={(e) => onChange({ from: e.target.value })} className="mt-1 h-11 w-full rounded border border-ink/40 bg-white px-2.5 text-[0.9375rem] text-ink focus:border-mark-deep focus:outline-none focus:ring-2 focus:ring-mark-deep/30" />
          </label>
          <label className="block text-[0.8125rem] text-stone-700">{t('search.to')}
            <input type="date" value={filters.to} min={filters.from || undefined} onChange={(e) => onChange({ to: e.target.value })} className="mt-1 h-11 w-full rounded border border-ink/40 bg-white px-2.5 text-[0.9375rem] text-ink focus:border-mark-deep focus:outline-none focus:ring-2 focus:ring-mark-deep/30" />
          </label>
        </div>
      </Group>

      <Group title={t('search.author')}>
        <div className="max-h-64 space-y-3 overflow-y-auto pe-2">
          {repo.authors().map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3">
              <CheckboxField label={a.name} checked={filters.authors.includes(a.id)} onChange={() => onChange({ authors: toggle(filters.authors, a.id) })} />
              <span className="font-sans text-[0.8125rem] tabular-nums text-stone-500">{count((x) => x.authors.includes(a.id))}</span>
            </div>
          ))}
        </div>
      </Group>
    </div>
  )
}
