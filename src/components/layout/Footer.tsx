import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { siteConfig } from '@/data/siteConfig'
import { useI18n } from '@/lib/i18n'
import estinLight from '@/assets/logos/estin-light.png'

const col = 'font-sans text-[0.9375rem] text-white/75 transition-colors hover:text-white'

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()
  const h = 'font-sans text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white/50 rtl:tracking-normal'
  return (
    <footer className="on-dark mt-24 bg-night text-white md:mt-32">
      <div className="page py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo tone="light" className="!h-10 md:!h-11" />
            <p className="mt-6 max-w-[38ch] font-display text-[1.25rem] leading-snug tracking-[-0.015em] text-white/90">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-[44ch] text-[0.9375rem] leading-relaxed text-white/65">{t('footer.about')}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            <nav aria-label={t('footer.explore')}>
              <h2 className={h}>{t('footer.explore')}</h2>
              <ul className="mt-4 space-y-3">
                <li><Link className={col} to="/issues">{t('nav.issues')}</Link></li>
                <li><Link className={col} to="/topics">{t('nav.topics')}</Link></li>
                <li><Link className={col} to="/search">{t('nav.search')}</Link></li>
                <li><Link className={col} to="/contribute">{t('nav.contribute')}</Link></li>
              </ul>
            </nav>
            <nav aria-label={t('footer.journal')}>
              <h2 className={h}>{t('footer.journal')}</h2>
              <ul className="mt-4 space-y-3">
                <li><Link className={col} to="/about">{t('nav.about')}</Link></li>
                <li><Link className={col} to="/about#team">{t('about.team')}</Link></li>
                <li><Link className={col} to="/contribute#guidelines">{t('footer.guidelines')}</Link></li>
                <li><Link className={col} to="/about#contact">{t('footer.contact')}</Link></li>
              </ul>
            </nav>
            <div>
              <h2 className={h}>{t('footer.university')}</h2>
              <a href={siteConfig.university.url} target="_blank" rel="noopener noreferrer" className="mt-4 block w-24" aria-label={`${siteConfig.university.short} (${t('common.newTab')})`}>
                <img src={estinLight} alt="ESTIN" width={703} height={254} className="h-auto w-full opacity-90 transition-opacity hover:opacity-100" />
              </a>
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-white/60">{siteConfig.university.city}, {siteConfig.university.country}</p>
            </div>
            <div>
              <h2 className={h}>{t('footer.follow')}</h2>
              <ul className="mt-4 space-y-3">
                {siteConfig.social.map((s) => <li key={s.label}><a className={col} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}<span className="sr-only"> ({t('common.newTab')})</span></a></li>)}
                <li><a className={col} href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-white/15 pt-6 text-[0.8125rem] text-white/60">
          <p>© {year} {siteConfig.name} · {siteConfig.university.short}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {(['terms', 'privacy', 'cookies', 'legal'] as const).map((k) => <li key={k}><Link className="hover:text-white hover:underline" to={`/legal/${k}`}>{t(`legal.${k}` as 'legal.terms')}</Link></li>)}
          </ul>
          <div className="flex items-center gap-4">
            <LanguageSwitcher tone="light" />
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }) }} className="inline-flex items-center gap-1.5 hover:text-white"><ArrowUp className="h-4 w-4" aria-hidden />{t('footer.top')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
