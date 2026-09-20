import { useI18n } from '@/lib/i18n'
import Button from '@/components/ui/Button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function NotFoundPage() {
  const { t } = useI18n()
  useDocumentTitle('404')
  return (
    <div className="page py-24 md:py-40">
      <p className="font-display text-[clamp(5rem,16vw,12rem)] font-bold leading-none tracking-[-0.05em] text-mark">404</p>
      <h1 className="t-h1 mt-6 max-w-[18ch]">{t('notFound.title')}</h1>
      <p className="mt-4 max-w-[46ch] text-stone-700">{t('notFound.text')}</p>
      <div className="mt-8 flex flex-wrap gap-3"><Button to="/" variant="dark">{t('notFound.home')}</Button><Button to="/search" variant="outline">{t('nav.search')}</Button></div>
    </div>
  )
}
