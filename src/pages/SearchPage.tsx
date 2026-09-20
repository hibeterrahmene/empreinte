import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import type { SearchFilters, SearchHit } from '@/types'
import { repo } from '@/data/repository'
import { activeFilterCount, emptyFilters, filtersFromParams, filtersToParams, tokenize } from '@/lib/search'
import { useI18n } from '@/lib/i18n'
import { formatDate } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import SearchBar from '@/components/editorial/SearchBar'
import FilterPanel from '@/components/editorial/FilterPanel'
import ArticleCard from '@/components/editorial/ArticleCard'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Chip } from '@/components/ui/Tag'

function Skeleton() {
  return (
    <div aria-hidden className="divide-y divide-ink/15">
      {[0, 1, 2].map((i) => (
        <div key={i} className="grid gap-10 py-8 md:grid-cols-[1fr_200px]">
          <div className="space-y-4"><div className="skeleton h-5 w-24" /><div className="skeleton h-8 w-4/5" /><div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-2/3" /></div>
          <div className="skeleton hidden aspect-[4/3] md:block" />
        </div>
      ))}
    </div>
  )
}

export default function SearchPage() {
  const { t, lang, cat } = useI18n()
  useDocumentTitle(t('search.title'))
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => filtersFromParams(params), [params])
  const [qInput, setQInput] = useState(filters.q)
  const [hits, setHits] = useState<SearchHit[] | null>(null)
  const [drawer, setDrawer] = useState(false)
  const count = activeFilterCount(filters)

  const update = (patch: Partial<SearchFilters>) => setParams(filtersToParams({ ...filters, ...patch }), { replace: true })
  const reset = () => { setQInput(''); setParams(new URLSearchParams(), { replace: true }) }

  // Saisie → URL (anti-rebond) ; URL → saisie (liens externes, retour arrière).
  useEffect(() => { if (qInput !== filters.q) { const id = window.setTimeout(() => update({ q: qInput }), 260); return () => window.clearTimeout(id) } }, [qInput]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setQInput(filters.q) }, [filters.q])

  // Recherche asynchrone (comme un appel API).
  const key = params.toString()
  useEffect(() => {
    let live = true
    setHits(null)
    repo.search(filters).then((h) => { if (live) setHits(h) })
    return () => { live = false }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const tokens = tokenize(filters.q)
  const chips: { key: string; label: string; remove: () => void }[] = [
    ...filters.topics.map((v) => ({ key: `t${v}`, label: cat(v), remove: () => update({ topics: filters.topics.filter((x) => x !== v) }) })),
    ...filters.years.map((v) => ({ key: `y${v}`, label: v, remove: () => update({ years: filters.years.filter((x) => x !== v) }) })),
    ...filters.issues.map((v) => ({ key: `i${v}`, label: t('common.issueN', { n: repo.issue(v)?.number ?? '' }), remove: () => update({ issues: filters.issues.filter((x) => x !== v) }) })),
    ...filters.authors.map((v) => ({ key: `a${v}`, label: repo.author(v)?.name ?? v, remove: () => update({ authors: filters.authors.filter((x) => x !== v) }) })),
    ...(filters.from ? [{ key: 'from', label: `${t('search.from')} ${formatDate(filters.from, lang, { day: 'numeric', month: 'short', year: 'numeric' })}`, remove: () => update({ from: '' }) }] : []),
    ...(filters.to ? [{ key: 'to', label: `${t('search.to')} ${formatDate(filters.to, lang, { day: 'numeric', month: 'short', year: 'numeric' })}`, remove: () => update({ to: '' }) }] : []),
  ]

  const panel = <FilterPanel filters={filters} onChange={update} onReset={reset} activeCount={count} />

  return (
    <div className="page pt-12 md:pt-20">
      <header>
        <h1 className="t-h1">{t('search.title')}</h1>
        <div className="mt-6 max-w-4xl md:mt-8"><SearchBar value={qInput} onChange={setQInput} onSubmit={() => update({ q: qInput })} size="lg" /></div>
      </header>

      <div className="mt-10 grid gap-12 border-t border-ink pt-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
        <aside aria-label={t('search.filters')} className="hidden lg:block"><div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pe-4">{panel}</div></aside>

        <section aria-labelledby="results-h" aria-busy={hits === null}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="results-h" className="font-sans text-[0.9375rem] font-medium" role="status" aria-live="polite">
              {hits === null ? t('search.loading') : t('search.results', { n: hits.length })}
              {hits !== null && filters.q.trim() && <span className="text-stone-700"> {t('search.for', { q: filters.q.trim() })}</span>}
            </h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="lg:hidden !border-ink !text-ink hover:!bg-ink hover:!text-white" icon={<SlidersHorizontal className="h-4 w-4" aria-hidden />} onClick={() => setDrawer(true)} aria-haspopup="dialog">{t('search.filters')}{count ? ` (${count})` : ''}</Button>
              <label className="flex items-center gap-2 font-sans text-[0.875rem] text-stone-700">{t('search.sort')}
                <select value={filters.sort} onChange={(e) => update({ sort: e.target.value as SearchFilters['sort'] })} className="h-10 rounded border border-ink/40 bg-white px-2.5 text-[0.875rem] text-ink focus:border-mark-deep focus:outline-none focus:ring-2 focus:ring-mark-deep/30">
                  <option value="relevance">{t('search.sortRelevance')}</option>
                  <option value="newest">{t('search.sortNewest')}</option>
                  <option value="oldest">{t('search.sortOldest')}</option>
                </select>
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="mt-5 flex flex-wrap items-center gap-2" aria-label={t('search.activeFilters')}>
              {chips.map((c) => (
                <li key={c.key}>
                  <button type="button" onClick={c.remove} className="inline-flex items-center gap-1.5 rounded border border-ink bg-ink py-1.5 ps-3 pe-2 font-sans text-[0.8125rem] font-medium text-white transition-colors hover:bg-night-soft" aria-label={`${t('search.removeFilter')}: ${c.label}`}>{c.label}<X className="h-3.5 w-3.5" aria-hidden /></button>
                </li>
              ))}
              <li><button type="button" onClick={() => update({ ...emptyFilters, q: filters.q, sort: filters.sort, fullText: filters.fullText })} className="link ms-2 font-sans text-[0.8125rem] font-semibold">{t('search.clearFilters')}</button></li>
            </ul>
          )}

          <div className="mt-2">
            {hits === null && <Skeleton />}
            {hits && hits.length > 0 && (
              <ol key={key} className="divide-y divide-ink/15">
                {hits.map((h, i) => <li key={h.article.slug} className="swap-in" style={{ '--swap-delay': `${Math.min(i, 6) * 45}ms` } as React.CSSProperties}><ArticleCard article={h.article} variant="result" tokens={tokens} snippet={h.snippet} /></li>)}
              </ol>
            )}
            {hits && hits.length === 0 && (
              <div className="swap-in border-y border-ink/15 py-16 text-center">
                <h3 className="t-h2">{t('search.noneTitle')}</h3>
                <p className="mx-auto mt-3 max-w-[46ch] text-stone-700">{t('search.noneText')}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {repo.categories().slice(0, 4).map((c) => <Chip key={c.slug} onClick={() => setParams(new URLSearchParams({ topic: c.slug }), { replace: true })}>{cat(c.slug)}</Chip>)}
                </div>
                <div className="mt-8"><Button variant="dark" onClick={reset}>{t('search.reset')}</Button></div>
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal open={drawer} onClose={() => setDrawer(false)} title={t('search.filters')} className="!max-w-lg">
        {panel}
        <div className="sticky bottom-0 -mx-6 mt-6 border-t border-ink/15 bg-white px-6 pt-4 md:-mx-8 md:px-8"><Button full onClick={() => setDrawer(false)}>{t('search.showResults', { n: hits?.length ?? 0 })}</Button></div>
      </Modal>
    </div>
  )
}
