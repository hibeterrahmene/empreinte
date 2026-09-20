import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { repo } from '@/data/repository'
import { articleImage } from '@/lib/articleImage'
import { useI18n } from '@/lib/i18n'
import { readingMinutes, formatDate } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Metadata from '@/components/editorial/Metadata'
import AuthorCard from '@/components/editorial/AuthorCard'
import ArticleCard from '@/components/editorial/ArticleCard'
import IssueCover from '@/components/editorial/IssueCover'
import ArticleBody from '@/components/article/ArticleBody'
import CitationBlock from '@/components/article/CitationBlock'
import ShareBar from '@/components/article/ShareBar'
import TableOfContents from '@/components/article/TableOfContents'
import SectionHeading from '@/components/ui/SectionHeading'
import NotFoundPage from './NotFoundPage'

export default function ArticlePage() {
  const { slug = '' } = useParams()
  const { t, lang, cat } = useI18n()
  const article = repo.article(slug)
  const bodyRef = useRef<HTMLDivElement>(null)
  const progress = useReadingProgress(bodyRef)
  useDocumentTitle(article?.title)
  if (!article) return <NotFoundPage />

  const authors = repo.authorsOf(article)
  const issue = repo.issue(article.issue)
  const im = article.image ? articleImage(article) : null
  const sameIssue = repo.articlesOfIssue(article.issue).filter((a) => a.slug !== article.slug)
  const related = repo.related(article, 3)
  const minutes = readingMinutes(article)

  return (
    <article>
      {/* Barre de progression de lecture */}
      <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
        <div className="h-full origin-left bg-mark transition-transform duration-150 ease-out rtl:origin-right" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className="page pt-6 md:pt-8">
        {issue && (
          <nav aria-label={t('common.breadcrumb')} className="flex flex-wrap items-center gap-1.5 font-sans text-[0.8125rem] text-stone-700">
            <Link to="/issues" className="link">{t('nav.issues')}</Link><ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
            <Link to={`/issues/${issue.slug}`} className="link">{t('common.issueN', { n: issue.number })} · {issue.title}</Link>
          </nav>
        )}
      </div>

      <header className="page mt-10 text-center md:mt-14">
        <Tag to={`/search?topic=${article.category}`}>{cat(article.category)}</Tag>
        <h1 lang={article.lang} dir={article.lang === 'ar' ? 'rtl' : 'ltr'} className="t-display mx-auto mt-6 max-w-[20ch] !text-[clamp(2.125rem,5.6vw,4.75rem)] !leading-[1.04] [text-wrap:balance]">{article.title}</h1>
        <p lang={article.lang} className="t-lede mx-auto mt-6 max-w-[44ch] text-stone-700 [text-wrap:balance]">{article.deck}</p>
        <Metadata authors={authors} date={article.date} minutes={minutes} link center className="mt-8" />
        {issue && <p className="mt-3 font-sans text-[0.8125rem] text-stone-500">{t('article.publishedIn')} <Link to={`/issues/${issue.slug}`} className="link text-ink">{t('common.issueN', { n: issue.number })}</Link> · {formatDate(issue.date, lang)}{article.pages ? ` · ${t('issues.pp', { p: article.pages })}` : ''}</p>}
        {article.demo && <p className="mx-auto mt-4 inline-block border border-ink/20 px-2.5 py-1 font-sans text-[0.75rem] text-stone-500">Demo article · placeholder content</p>}
      </header>

      {im && (
        <figure className="page mt-10 max-w-wide md:mt-14">
          <div className="overflow-hidden bg-cream"><img src={im.src} alt={im.alt} style={{ objectPosition: im.position }} className="aspect-[16/9] w-full object-cover md:aspect-[2/1]" /></div>
          {im.caption && <figcaption className="mt-3 border-t border-ink/15 pt-3 font-sans text-[0.8125rem] text-stone-700">{im.caption}</figcaption>}
        </figure>
      )}

      <div className="page mt-12 grid gap-x-12 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,680px)_minmax(0,1fr)]">
        <aside className="hidden justify-self-end lg:block" aria-label={t('article.inThisArticle')}><div className="w-56"><TableOfContents article={article} /></div></aside>
        <div ref={bodyRef} className="min-w-0">
          <ArticleBody article={article} />
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-y border-ink/15 py-5">
            <ShareBar title={article.title} path={`/articles/${article.slug}`} />
            <CitationBlock article={article} authors={authors} issue={issue} />
          </div>
          <section aria-labelledby="authors-h" className="mt-12">
            <h2 id="authors-h" className="t-label mb-6 text-stone-700">{authors.length > 1 ? t('article.aboutAuthors') : t('article.aboutAuthor')}</h2>
            <div className="space-y-8">{authors.map((a) => <AuthorCard key={a.id} author={a} />)}</div>
          </section>
        </div>
        <div />
      </div>

      {/* Retour au numéro */}
      {issue && (
        <section aria-labelledby="issue-h" className="page mt-20 md:mt-28">
          <SectionHeading id="issue-h" title={t('article.fromIssue')} to={`/issues/${issue.slug}`} action={t('article.backToIssue')} />
          <div className="grid gap-10 md:grid-cols-[200px_1fr] md:gap-14">
            <Link to={`/issues/${issue.slug}`} aria-label={`${t('article.backToIssue')} — ${issue.title}`} className="mx-auto block w-40 border border-ink/10 md:w-full"><IssueCover issue={issue} /></Link>
            <div>
              <p className="font-sans text-[0.875rem] font-semibold text-mark-deep">{t('common.issueN', { n: issue.number })} <span className="font-normal text-stone-700">— {issue.title}</span></p>
              {sameIssue.length > 0 ? (
                <ul className="mt-4 grid gap-x-12 divide-y divide-ink/15 border-t border-ink/15 md:grid-cols-2 md:divide-y-0">
                  {sameIssue.slice(0, 4).map((a) => <li key={a.slug} className="border-b border-ink/15 py-5"><ArticleCard article={a} variant="text" /></li>)}
                </ul>
              ) : <p className="mt-4 text-stone-700">{t('article.onlyArticle')}</p>}
              <div className="mt-6"><Button to={`/issues/${issue.slug}`} variant="dark" arrow>{t('article.backToIssue')}</Button></div>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-h" className="page mt-20 md:mt-28">
          <SectionHeading id="related-h" title={t('article.related')} />
          <ul className="grid gap-10 md:grid-cols-3">
            {related.map((a) => <li key={a.slug}><ArticleCard article={a} variant="feature" className="[&_h3]:!text-[1.5rem]" /></li>)}
          </ul>
        </section>
      )}
    </article>
  )
}
