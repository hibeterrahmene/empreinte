import { Link, useParams } from 'react-router-dom'
import { BookOpen, ChevronRight, Download } from 'lucide-react'
import { repo } from '@/data/repository'
import { articleImage } from '@/lib/articleImage'
import { useI18n } from '@/lib/i18n'
import { formatDate, readingMinutes } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Reveal from '@/components/ui/Reveal'
import IssueCover from '@/components/editorial/IssueCover'
import Metadata from '@/components/editorial/Metadata'
import NotFoundPage from './NotFoundPage'

export default function IssuePage() {
  const { slug = '' } = useParams()
  const { t, lang, cat } = useI18n()
  const issue = repo.issue(slug)
  useDocumentTitle(issue ? `${t('common.issueN', { n: issue.number })} — ${issue.title}` : undefined)
  if (!issue) return <NotFoundPage />

  const items = repo.articlesOfIssue(issue.slug)
  const all = repo.issues()
  const idx = all.findIndex((i) => i.slug === issue.slug)
  const newer = all[idx - 1]
  const older = all[idx + 1]

  return (
    <>
      <div className="page pt-8">
        <nav aria-label={t('common.breadcrumb')} className="flex items-center gap-1.5 font-sans text-[0.8125rem] text-stone-700">
          <Link to="/issues" className="link">{t('nav.issues')}</Link><ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
          <span aria-current="page" className="text-ink">{t('common.issueN', { n: issue.number })}</span>
        </nav>
      </div>

      <header className="page mt-8 grid gap-10 md:mt-12 lg:grid-cols-12 lg:gap-16">
        <div className="mx-auto w-full max-w-[22rem] lg:col-span-5 lg:max-w-none">
          <div className="border border-ink/10"><IssueCover issue={issue} priority /></div>
        </div>
        <div className="flex flex-col justify-end lg:col-span-7">
          <p className="font-sans text-[0.9375rem] font-semibold text-mark-deep">{t('common.issueN', { n: issue.number })} <span className="font-normal text-stone-700">— <time dateTime={issue.date}>{formatDate(issue.date, lang)}</time>{issue.pages ? ` · ${t('issues.pages', { n: issue.pages })}` : ''}</span></p>
          <h1 className="t-display mt-3 !text-[clamp(2.5rem,5.6vw,5rem)]">{issue.title}</h1>
          {issue.subtitle && <p className="t-lede mt-4 text-stone-700">{issue.subtitle}</p>}
          <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink/85">{issue.summary}</p>
          {issue.demo && <p className="mt-4 inline-block self-start border border-ink/20 px-2.5 py-1 font-sans text-[0.75rem] text-stone-500">Demo issue · placeholder content</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {issue.pdfUrl && <Button href={issue.pdfUrl} download size="lg" icon={<Download className="h-4 w-4" aria-hidden />}>{t('issues.downloadPdf')}</Button>}
            {items[0] && <Button to={`/articles/${items[0].slug}`} variant="dark" size="lg" icon={<BookOpen className="h-4 w-4" aria-hidden />}>{t('issues.read')}</Button>}
          </div>
        </div>
      </header>

      {/* Éditorial */}
      <section aria-labelledby="ed-h" className="page mt-20 grid gap-8 border-t border-ink pt-10 md:mt-28 lg:grid-cols-12 lg:gap-16">
        <h2 id="ed-h" className="t-h3 lg:col-span-4">{t('issues.editorial')}</h2>
        <div className="space-y-5 lg:col-span-7">
          {issue.editorial.map((p, i) => <p key={i} className={i === 0 ? 't-lede' : 'max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink/85'}>{p}</p>)}
        </div>
      </section>

      {/* Sommaire */}
      <section aria-labelledby="toc-h" className="page mt-20 md:mt-28">
        <div className="mb-2 flex items-end justify-between gap-6 border-b border-ink pb-4">
          <h2 id="toc-h" className="t-h2">{t('issues.contents')}</h2>
          <p className="font-sans text-[0.875rem] text-stone-500">{t('issues.articleCount', { n: items.length })}</p>
        </div>
        <ol className="divide-y divide-ink/15">
          {items.map((a, i) => {
            const authors = repo.authorsOf(a)
            const im = a.image ? articleImage(a) : null
            return (
              <Reveal as="li" key={a.slug} delay={Math.min(i, 4) * 50} className="group/card relative grid gap-4 py-8 md:grid-cols-[120px_minmax(0,1fr)_200px] md:gap-10 md:py-10">
                <p className="font-sans text-[0.875rem] tabular-nums text-stone-500">{a.pages ? t('issues.pp', { p: a.pages }) : ''}</p>
                <div>
                  <Tag to={`/search?topic=${a.category}`} className="relative z-10">{cat(a.category)}</Tag>
                  <h3 className="t-h2 mt-3">
                    <Link to={`/articles/${a.slug}`} lang={a.lang} className="after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-[6px]">{a.title}</Link>
                  </h3>
                  <p className="mt-3 max-w-[62ch] text-[1rem] leading-relaxed text-stone-700" lang={a.lang}>{a.deck}</p>
                  <Metadata authors={authors} minutes={readingMinutes(a)} size="sm" className="mt-4" />
                </div>
                <div className="hidden md:block">
                  {im && <div className="aspect-[4/3] overflow-hidden bg-cream"><img src={im.src} alt="" loading="lazy" style={{ objectPosition: im.position }} className="h-full w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover/card:scale-[1.04]" /></div>}
                </div>
              </Reveal>
            )
          })}
        </ol>
      </section>

      {/* Numéros voisins */}
      {(newer || older) && (
        <nav aria-label={t('issues.otherIssues')} className="page mt-20 grid gap-px border-y border-ink/15 sm:grid-cols-2">
          {older ? <Link to={`/issues/${older.slug}`} className="group flex flex-col gap-1 py-8 sm:pe-8"><span className="font-sans text-[0.8125rem] text-stone-500">← {t('issues.previous')}</span><span className="t-h3">{t('common.issueN', { n: older.number })} · {older.title}</span></Link> : <span />}
          {newer && <Link to={`/issues/${newer.slug}`} className="group flex flex-col gap-1 py-8 sm:border-s sm:border-ink/15 sm:ps-8 sm:text-end"><span className="font-sans text-[0.8125rem] text-stone-500">{t('issues.next')} →</span><span className="t-h3">{t('common.issueN', { n: newer.number })} · {newer.title}</span></Link>}
        </nav>
      )}
    </>
  )
}
