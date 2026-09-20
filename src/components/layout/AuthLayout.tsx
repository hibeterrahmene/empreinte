import { Link, Outlet } from 'react-router-dom'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { img } from '@/data/images'
import { useI18n } from '@/lib/i18n'

/** Connexion / inscription : formulaire à gauche, illustration à droite (comme la maquette). */
export default function AuthLayout() {
  const { t } = useI18n()
  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col">
        <header className="flex h-[var(--header-h)] items-center justify-between border-b border-ink/15 px-[var(--page-gutter)] lg:border-b-0">
          <Logo />
          <LanguageSwitcher />
        </header>
        <main id="main" className="page-transition flex flex-1 items-center px-[var(--page-gutter)] py-10 lg:px-[clamp(2rem,8vw,7rem)]">
          <div className="mx-auto w-full max-w-[30rem] lg:mx-0"><Outlet /></div>
        </main>
        <p className="px-[var(--page-gutter)] pb-6 text-[0.8125rem] text-stone-500 lg:px-[clamp(2rem,8vw,7rem)]"><Link to="/" className="link">← {t('auth.backToSite')}</Link></p>
      </div>
      <div className="relative hidden overflow-hidden bg-cream lg:block" aria-hidden>
        <img src={img.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" />
      </div>
    </div>
  )
}
