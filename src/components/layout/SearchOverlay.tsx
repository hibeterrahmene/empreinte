import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import SearchBar from '@/components/editorial/SearchBar'
import { repo } from '@/data/repository'
import { emptyFilters, runSearch, tokenize } from '@/lib/search'
import { useI18n } from '@/lib/i18n'
import Highlight from '@/components/editorial/Highlight'
import { Arrow } from '@/components/ui/Button'

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { t, cat } = useI18n()
  const tokens = tokenize(q)
  const hits = useMemo(() => (q.trim().length > 1 ? runSearch(repo.articles(), repo.authors(), { ...emptyFilters, q, fullText: false }).slice(0, 4) : []), [q])
  const go = () => { onClose(); nav(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search') }
  return (
    <Modal open={open} onClose={onClose} title={t('search.title')} variant="top" hideTitle>
      <div className="page py-6 md:py-10">
        <div className="flex items-start gap-4">
          <div className="flex-1"><SearchBar value={q} onChange={setQ} onSubmit={go} size="lg" autoFocus /></div>
          <button type="button" onClick={onClose} aria-label={t('common.close')} className="mt-3 rounded p-2 hover:bg-ink/5 md:mt-5"><X className="h-6 w-6" aria-hidden /></button>
        </div>
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="t-label text-stone-500">{t('nav.topics')}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {repo.categories().map((c) => <li key={c.slug}><Link onClick={onClose} to={`/search?topic=${c.slug}`} className="link font-sans text-[0.9375rem] font-medium">{cat(c.slug)}</Link></li>)}
            </ul>
          </div>
          <div aria-live="polite">
            {hits.length > 0 ? (
              <ul className="divide-y divide-ink/15 border-y border-ink/15">
                {hits.map(({ article }) => (
                  <li key={article.slug}>
                    <Link onClick={onClose} to={`/articles/${article.slug}`} className="group flex items-center justify-between gap-4 py-3.5">
                      <span className="t-h4"><Highlight text={article.title} tokens={tokens} /></span><Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : q.trim().length > 1 ? (
              <p className="text-stone-700">{t('search.noResultsShort', { q })}</p>
            ) : (
              <p className="text-stone-500">{t('search.hint')}</p>
            )}
            {q.trim() && <button type="button" onClick={go} className="link mt-4 font-sans text-[0.875rem] font-semibold">{t('search.seeAll')}</button>}
          </div>
        </div>
      </div>
    </Modal>
  )
}
