import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import type { Issue } from '@/types'
import { repo } from '@/data/repository'
import { formatDate } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import IssueCover from './IssueCover'
import Button, { Arrow } from '@/components/ui/Button'

/** Entrée d'archive : couverture, numéro, date, résumé, accès et PDF. */
export default function IssueCard({ issue }: { issue: Issue }) {
  const { t, lang } = useI18n()
  const count = repo.articlesOfIssue(issue.slug).length
  return (
    <article className="group/card relative grid grid-cols-[minmax(110px,38%)_1fr] gap-5 sm:grid-cols-1 sm:gap-6">
      <Link to={`/issues/${issue.slug}`} aria-hidden tabIndex={-1} className="block overflow-hidden border border-ink/10 bg-cream">
        <div className="transition-transform duration-[900ms] ease-editorial group-hover/card:scale-[1.03]"><IssueCover issue={issue} /></div>
      </Link>
      <div className="flex flex-col">
        <p className="font-sans text-[0.875rem] font-semibold text-mark-deep">{t('common.issueN', { n: issue.number })} <span className="font-normal text-stone-700">— <time dateTime={issue.date}>{formatDate(issue.date, lang)}</time></span></p>
        <h3 className="t-h3 mt-2">
          <Link to={`/issues/${issue.slug}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">{issue.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-4 text-[0.9375rem] leading-relaxed text-stone-700">{issue.summary}</p>
        <p className="mt-3 font-sans text-[0.8125rem] text-stone-500">{t('issues.articleCount', { n: count })}{issue.pages ? ` · ${t('issues.pages', { n: issue.pages })}` : ''}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to={`/issues/${issue.slug}`} className="group inline-flex items-center gap-1.5 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] rtl:tracking-normal"><span className="link">{t('issues.view')}</span><Arrow /></Link>
          {issue.pdfUrl && <Button href={issue.pdfUrl} download variant="ghost" size="sm" icon={<Download className="h-4 w-4" aria-hidden />} aria-label={`${t('issues.downloadPdf')} — ${t('common.issueN', { n: issue.number })}`}>PDF</Button>}
        </div>
      </div>
    </article>
  )
}
