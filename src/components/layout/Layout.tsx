import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useI18n } from '@/lib/i18n'

/** Défilement en haut / vers l'ancre à chaque navigation, puis focus sur <main> (lecteurs d'écran, clavier). */
function ScrollManager({ main }: { main: React.RefObject<HTMLElement | null> }) {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); return }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    if (!first.current) main.current?.focus({ preventScroll: true })
    first.current = false
  }, [pathname, hash, main])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  const { t } = useI18n()
  const main = useRef<HTMLElement>(null)
  const reading = pathname.startsWith('/articles/')
  return (
    <div id="top">
      <a href="#main" onClick={(e) => { e.preventDefault(); main.current?.focus(); main.current?.scrollIntoView() }} className="fixed start-4 top-4 z-[200] -translate-y-24 rounded bg-ink px-4 py-3 font-sans text-sm font-semibold text-white focus:translate-y-0">{t('common.skip')}</a>
      <Header showTopics={!reading} />
      <main id="main" ref={main} tabIndex={-1} key={pathname} className="page-transition outline-none">
        <Outlet />
      </main>
      <Footer />
      <ScrollManager main={main} />
    </div>
  )
}
