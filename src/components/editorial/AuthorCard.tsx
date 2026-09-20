import { Link } from 'react-router-dom'
import type { Author } from '@/types'
import { AuthorAvatar } from './Metadata'
import { Arrow } from '@/components/ui/Button'
import { useI18n } from '@/lib/i18n'
import { repo } from '@/data/repository'

export default function AuthorCard({ author }: { author: Author }) {
  const { t } = useI18n()
  const count = repo.articles().filter((a) => a.authors.includes(author.id)).length
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
      <AuthorAvatar name={author.name} size={56} className="row-span-3" />
      <p className="font-display text-[1.25rem] font-semibold leading-tight tracking-[-0.02em]">{author.name}</p>
      <p className="font-sans text-[0.8125rem] text-stone-700">{author.role} · {author.affiliation}</p>
      <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-stone-700">{author.bio}</p>
      <Link to={`/search?author=${author.id}`} className="group col-start-2 mt-3 inline-flex items-center gap-1.5 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] rtl:tracking-normal">
        <span className="link">{t('article.moreByAuthor', { n: count })}</span><Arrow />
      </Link>
    </div>
  )
}
