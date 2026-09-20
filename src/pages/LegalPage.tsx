import { Navigate, useParams } from 'react-router-dom'
import { useI18n } from '@/lib/i18n'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const slugs = ['terms', 'privacy', 'cookies', 'legal'] as const

/** PLACEHOLDER — à remplacer par les textes juridiques validés par l'établissement. */
export default function LegalPage() {
  const { slug = '' } = useParams()
  const { t } = useI18n()
  const key = slugs.find((s) => s === slug)
  useDocumentTitle(key ? t(`legal.${key}`) : undefined)
  if (!key) return <Navigate to="/" replace />
  return (
    <div className="page max-w-read py-16 md:py-24">
      <h1 className="t-h1">{t(`legal.${key}`)}</h1>
      <p className="mt-6 border-s-4 border-sun bg-cream p-4 text-[0.9375rem]">{t('legal.placeholder')}</p>
      <div className="prose-article mt-10 !text-[1.0625rem]">
        <p>This page will contain the {t(`legal.${key}`).toLowerCase()} of L'Empreinte, the student journal of ESTIN.</p>
        <p>It should be written or approved by the institution's legal or administrative office before the site is published.</p>
      </div>
    </div>
  )
}
