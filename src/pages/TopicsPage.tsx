import { Link } from 'react-router-dom'
import { repo } from '@/data/repository'
import { useI18n } from '@/lib/i18n'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Arrow } from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'

export default function TopicsPage() {
  const { t, cat } = useI18n()
  useDocumentTitle(t('nav.topics'))
  return (
    <div className="page pt-12 md:pt-20">
      <header className="grid gap-6 border-b border-ink pb-10 md:grid-cols-12 md:pb-14">
        <h1 className="t-display md:col-span-7">{t('nav.topics')}</h1>
        <p className="t-lede max-w-[40ch] self-end text-stone-700 md:col-span-5">{t('topics.intro')}</p>
      </header>
      <ul>
        {repo.categories().map((c, i) => {
          const list = repo.articlesOfCategory(c.slug)
          const latest = [...list].sort((a, b) => b.date.localeCompare(a.date))[0]
          return (
            <Reveal as="li" key={c.slug} delay={Math.min(i, 3) * 40} className="border-b border-ink/15">
              <Link to={`/search?topic=${c.slug}`} className="group grid gap-4 py-8 md:grid-cols-12 md:gap-10 md:py-10">
                <h2 className="t-h1 !text-[clamp(1.875rem,3.6vw,3rem)] transition-colors group-hover:text-mark-deep md:col-span-5">{cat(c.slug)}</h2>
                <p className="max-w-[44ch] text-[1rem] leading-relaxed text-stone-700 md:col-span-4">{c.description}</p>
                <div className="flex items-start justify-between gap-6 md:col-span-3">
                  <p className="font-sans text-[0.875rem] text-stone-500">{t('topics.count', { n: list.length })}{latest && <><br /><span className="text-ink" lang={latest.lang}>{latest.title}</span></>}</p>
                  <Arrow className="mt-1" />
                </div>
              </Link>
            </Reveal>
          )
        })}
      </ul>
    </div>
  )
}
