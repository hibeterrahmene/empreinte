import { useState } from 'react'
import { repo } from '@/data/repository'
import { useI18n } from '@/lib/i18n'
import { yearOf } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import IssueCard from '@/components/editorial/IssueCard'
import { Chip } from '@/components/ui/Tag'
import Reveal from '@/components/ui/Reveal'

/** Archive éditoriale : les numéros regroupés par année, l'année en repère typographique. */
export default function IssuesPage() {
  const { t } = useI18n()
  useDocumentTitle(t('nav.issues'))
  const [year, setYear] = useState<string>('all')
  const years = repo.issueYears()
  const visible = repo.issues().filter((i) => year === 'all' || yearOf(i.date) === year)
  const groups = years.filter((y) => visible.some((i) => yearOf(i.date) === y))

  return (
    <div className="page pt-12 md:pt-20">
      <header className="grid gap-6 border-b border-ink pb-10 md:grid-cols-12 md:pb-14">
        <h1 className="t-display md:col-span-7">{t('issues.title')}</h1>
        <p className="t-lede max-w-[40ch] self-end text-stone-700 md:col-span-5">{t('issues.intro')}</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/15 py-5">
        <div role="group" aria-label={t('issues.filterYear')} className="flex flex-wrap gap-2">
          <Chip active={year === 'all'} onClick={() => setYear('all')}>{t('issues.allYears')}</Chip>
          {years.map((y) => <Chip key={y} active={year === y} onClick={() => setYear(y)}>{y}</Chip>)}
        </div>
        <p className="font-sans text-[0.875rem] text-stone-500" role="status" aria-live="polite">{t('issues.count', { n: visible.length })}</p>
      </div>

      {groups.map((y) => (
        <section key={y} aria-labelledby={`y-${y}`} className="grid gap-8 border-b border-ink/15 py-12 last:border-b-0 lg:grid-cols-[180px_1fr] lg:gap-12 lg:py-16">
          <h2 id={`y-${y}`} className="t-h1 self-start lg:sticky lg:top-28">{y}</h2>
          <ul key={year} className="grid gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {visible.filter((i) => yearOf(i.date) === y).map((i, k) => <Reveal as="li" key={i.slug} delay={k * 80}><IssueCard issue={i} /></Reveal>)}
          </ul>
        </section>
      ))}
    </div>
  )
}
