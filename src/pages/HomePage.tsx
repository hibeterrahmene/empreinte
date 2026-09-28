import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { repo } from '@/data/repository'
import { img } from '@/data/images'
import { useI18n } from '@/lib/i18n'
import { formatDate, cx } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import Button, { Arrow } from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'
import ArticleCard from '@/components/editorial/ArticleCard'
import IssueCover from '@/components/editorial/IssueCover'
import QuoteSection from '@/components/editorial/QuoteSection'
import Wave from '@/components/editorial/Wave'
import estinColor from '@/assets/logos/estin-color.png'

type Tab = 'featured' | 'recent' | 'popular'
const PAGE = 4

export default function HomePage() {
  const { t, lang, cat } = useI18n()
  useDocumentTitle()
  const [tab, setTab] = useState<Tab>('featured')
  const [page, setPage] = useState(0)
  const issue = repo.featuredIssue()
  const isLatest = issue.slug === repo.latestIssue().slug
  const lists: Record<Tab, ReturnType<typeof repo.featured>> = { featured: repo.featured(4), recent: repo.recent(4), popular: repo.popular(4) }
  const list = lists[tab]
  const more = repo.recent(12)
  const pages = Math.ceil(more.length / PAGE)

  return (
    <>
      {/* 1 — Ouverture : la citation de la maquette et l'illustration du campus */}
      <section aria-labelledby="hero-h" className="relative -mt-px bg-cream">
        <div className="page grid items-center gap-8 pb-24 pt-8 md:pb-40 md:pt-12 lg:grid-cols-12 lg:gap-14 lg:pt-14">
          <div className="lg:col-span-5">
            <div className="mx-auto aspect-[4/3] max-w-[34rem] overflow-hidden sm:aspect-[5/4] lg:aspect-[3/3.4] lg:max-w-none">
              <img src={img.poster} alt={t('home.heroAlt')} width={1024} height={1536} className="h-full w-full object-cover object-[50%_46%]" />
            </div>
          </div>
          <div className="lg:col-span-7 lg:ps-6">
            <h1 id="hero-h" className="t-display !text-[clamp(2.25rem,5.4vw,4.5rem)] !leading-[1.06]">
              “{t('home.quoteA')}<span className="text-mark">{t('home.quoteEm')}</span>{t('home.quoteB')}”
            </h1>
            <p className="mt-6 max-w-[46ch] font-display text-[1.125rem] leading-snug text-ink/80 md:text-[1.25rem]">{t('home.heroSub')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={`/issues/${issue.slug}`} variant="dark" size="lg" arrow>{t('home.readLatest')}</Button>
              <Button to="/contribute" variant="outline" size="lg" className="!border-ink !text-ink hover:!bg-ink hover:!text-white">{t('nav.contribute')}</Button>
            </div>
          </div>
        </div>
        <Wave />
      </section>

      {/* 2 — Explorer le contenu */}
      <section aria-labelledby="explore-h" className="page mt-8 md:mt-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 border-b border-ink/20 md:mb-10">
          <h2 id="explore-h" className="pb-3 font-sans text-[1.0625rem] font-bold uppercase tracking-[0.12em] text-stone-700 md:text-[1.25rem] rtl:tracking-normal">{t('home.explore')}</h2>
          <Tabs<Tab> idPrefix="explore" label={t('home.explore')} value={tab} onChange={setTab} tabs={[{ id: 'featured', label: t('home.tabFeatured') }, { id: 'recent', label: t('home.tabRecent') }, { id: 'popular', label: t('home.tabPopular') }]} />
        </div>
        <div key={tab} id="explore-panel" role="tabpanel" aria-labelledby={`explore-tab-${tab}`} className="swap-in grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7"><ArticleCard article={list[0]} variant="feature" /></div>
          <div className="lg:col-span-5">
            <ul className="divide-y divide-ink/15">
              {list.slice(1).map((a, i) => <li key={a.slug} className="swap-in py-6 first:pt-0 lg:first:pt-0 last:pb-0" style={{ '--swap-delay': `${80 + i * 70}ms` } as React.CSSProperties}><ArticleCard article={a} variant="thumb" /></li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 3 — Dernier numéro */}
      <section aria-labelledby="issue-h" className="on-dark mt-24 bg-night text-white md:mt-32">
        <div className="page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <span className="inline-block bg-mark-deep px-3 py-1.5 font-sans text-[0.75rem] font-bold uppercase tracking-[0.1em] rtl:tracking-normal">{isLatest ? t('home.latestIssue') : t('home.featuredIssue')}</span>
            <p className="mt-6 font-sans text-[0.875rem] font-medium uppercase tracking-[0.14em] text-white/70 rtl:tracking-normal">{t('common.issueN', { n: issue.number })} · {formatDate(issue.date, lang)}</p>
            <h2 id="issue-h" className="t-h1 mt-3 max-w-[16ch] text-white">{issue.title}</h2>
            <p className="mt-6 max-w-[52ch] text-[1rem] leading-relaxed text-white/80">{issue.summary}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button to={`/issues/${issue.slug}`} variant="white" size="lg">{t('home.viewIssue')}</Button>
              {issue.pdfUrl && <Button href={issue.pdfUrl} download variant="outlineLight" size="lg" icon={<Download className="h-4 w-4" aria-hidden />}>{t('issues.downloadPdf')}</Button>}
              <Link to="/issues" className="group inline-flex items-center gap-1.5 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] rtl:tracking-normal"><span className="link">{t('home.moreIssues')}</span><Arrow /></Link>
            </div>
          </div>
          <Link to={`/issues/${issue.slug}`} aria-label={`${t('home.viewIssue')} — ${issue.title}`} className="group mx-auto block w-full max-w-[22rem] lg:max-w-[26rem] lg:justify-self-end">
            <div className="overflow-hidden border border-white/15 transition-transform duration-500 ease-editorial group-hover:-translate-y-1.5"><IssueCover issue={issue} priority /></div>
          </Link>
        </div>
      </section>

      {/* 4 — Plus d'articles */}
      <section aria-labelledby="more-h" className="page mt-20 md:mt-28">
        <SectionHeading id="more-h" title={t('home.moreArticles')} to="/search" action={t('home.allArticles')} />
        <ul key={page} className="mx-auto max-w-[62rem] divide-y divide-ink/15 border-b border-ink/15">
          {more.slice(page * PAGE, page * PAGE + PAGE).map((a, i) => (
            <li key={a.slug} className="swap-in" style={{ '--swap-delay': `${i * 60}ms` } as React.CSSProperties}><ArticleCard article={a} variant="row" /></li>
          ))}
        </ul>
        {pages > 1 && (
          <nav aria-label={t('common.pagination')} className="mt-8 flex justify-center gap-1.5">
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} type="button" onClick={() => setPage(i)} aria-label={t('common.pageN', { n: i + 1 })} aria-current={i === page ? 'page' : undefined} className="group flex h-8 w-8 items-center justify-center">
                <span className={cx('h-2.5 w-2.5 rounded-full transition-all duration-300', i === page ? 'scale-110 bg-ink' : 'bg-ink/25 group-hover:bg-ink/50')} />
              </button>
            ))}
          </nav>
        )}
      </section>

      {/* 5 — Thématiques */}
      <section aria-labelledby="topics-h" className="page mt-24 md:mt-32">
        <SectionHeading id="topics-h" title={t('home.topics')} to="/topics" action={t('home.allTopics')} />
        <ul className="grid gap-x-16 md:grid-cols-2">
          {repo.categories().map((c, i) => (
            <Reveal as="li" key={c.slug} delay={(i % 2) * 70} className="border-b border-ink/15 first:border-t md:[&:nth-child(2)]:border-t">
              <Link to={`/search?topic=${c.slug}`} className="group flex items-baseline justify-between gap-6 py-6">
                <span>
                  <span className="t-h2 block !text-[clamp(1.5rem,2.4vw,2.125rem)] transition-colors group-hover:text-mark-deep">{cat(c.slug)}</span>
                  <span className="mt-1.5 block max-w-[42ch] text-[0.9375rem] leading-snug text-stone-700">{c.description}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3 font-sans text-[0.875rem] tabular-nums text-stone-500">{repo.articlesOfCategory(c.slug).length}<Arrow /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 6 — Citations */}
      <QuoteSection />

      {/* 7 — Le journal & l'ESTIN */}
      <section aria-labelledby="uni-h" className="page mt-24 md:mt-36">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="overflow-hidden lg:col-span-7"><img src={img.campusReal} alt={t('home.uniAlt')} loading="lazy" width={1536} height={1024} className="h-full max-h-[34rem] min-h-[16rem] w-full object-cover" /></div>
          <div className="flex flex-col justify-center lg:col-span-5">
            <img src={estinColor} alt="ESTIN" width={703} height={254} loading="lazy" className="h-12 w-auto self-start md:h-14" />
            <h2 id="uni-h" className="t-h2 mt-8">{t('home.uniTitle')}</h2>
            <p className="mt-4 max-w-[48ch] text-[1rem] leading-relaxed text-stone-700">{t('home.uniText')}</p>
            <div className="mt-8"><Button to="/about" variant="dark" arrow>{t('home.uniCta')}</Button></div>
          </div>
        </div>
      </section>
    </>
  )
}
