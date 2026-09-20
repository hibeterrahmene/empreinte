import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LogIn, Menu, Search, X } from 'lucide-react'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import SearchOverlay from './SearchOverlay'
import Button from '@/components/ui/Button'
import { AuthorAvatar } from '@/components/editorial/Metadata'
import { repo } from '@/data/repository'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/lib/i18n'
import { cx } from '@/lib/utils'

export default function Header({ showTopics = true }: { showTopics?: boolean }) {
  const { t, cat } = useI18n()
  const { user } = useAuth()
  const loc = useLocation()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)

  useEffect(() => { setMenu(false) }, [loc.pathname])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menu])

  const nav = [
    { to: '/issues', label: t('nav.issues') },
    { to: '/topics', label: t('nav.topics') },
    { to: '/about', label: t('nav.about') },
  ]
  const activeTopic = new URLSearchParams(loc.search).get('topic')
  const name = user ? `${user.firstName} ${user.lastName}`.trim() : ''

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="page flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo className="h-8 md:h-9 lg:h-10" />

        <nav aria-label={t('nav.main')} className="absolute inset-x-0 top-0 mx-auto hidden h-[var(--header-h)] w-fit items-stretch xl:flex">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => cx('group relative flex items-center px-6 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.16em] transition-colors duration-200 rtl:tracking-normal 2xl:px-10', isActive ? 'text-mark-deep' : 'text-stone-500 hover:text-ink')}>
              {({ isActive }) => (
                <>
                  {n.label}
                  <span aria-hidden className={cx('absolute inset-x-0 -bottom-px h-[3px] origin-center bg-mark transition-transform duration-300 ease-editorial', isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50')} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button type="button" onClick={() => setSearch(true)} aria-label={t('search.open')} aria-haspopup="dialog" className="flex h-10 w-10 items-center justify-center rounded-full bg-mark-deep text-white transition-colors hover:bg-[#245C8C]">
            <Search className="h-[18px] w-[18px]" aria-hidden />
          </button>
          <div className="hidden items-center gap-3 xl:flex">
            {user ? (
              <Link to="/profile" className="flex h-10 items-center gap-2.5 rounded border border-ink/25 ps-1.5 pe-3.5 font-sans text-[0.8125rem] font-semibold transition-colors hover:border-ink">
                <AuthorAvatar name={name || user.email} size={28} className="!bg-mark-pale !text-mark-deep" />{t('nav.profile')}
              </Link>
            ) : (
              <Button to="/login" variant="outline" size="sm" icon={<LogIn className="h-4 w-4" aria-hidden />}>{t('nav.login')}</Button>
            )}
            <Button to="/contribute" size="sm">{t('nav.contribute')}</Button>
            <LanguageSwitcher />
          </div>
          <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? t('common.close') : t('nav.menu')} className="-me-2 flex h-11 w-11 items-center justify-center rounded xl:hidden">
            {menu ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </div>

      {showTopics && (
        <nav aria-label={t('nav.topics')} className="hidden border-t border-ink/10 xl:block">
          <ul className="page no-scrollbar flex justify-center gap-x-10 overflow-x-auto xl:gap-x-14">
            {repo.categories().map((c) => (
              <li key={c.slug}>
                <Link to={`/search?topic=${c.slug}`} aria-current={activeTopic === c.slug ? 'page' : undefined} className={cx('relative block whitespace-nowrap py-3.5 font-sans text-[0.8125rem] uppercase tracking-[0.06em] transition-colors rtl:tracking-normal', activeTopic === c.slug ? 'font-semibold text-mark-deep' : 'text-ink hover:text-mark-deep')}>{cat(c.slug)}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {menu && (
        <div id="mobile-menu" className="sheet-in fixed inset-x-0 bottom-0 top-[var(--header-h)] z-30 overflow-y-auto bg-white xl:hidden">
          <div className="page flex min-h-full flex-col pb-10 pt-6">
            <nav aria-label={t('nav.main')}>
              <ul className="divide-y divide-ink/15 border-y border-ink/15">
                {nav.map((n) => (
                  <li key={n.to}><NavLink to={n.to} className={({ isActive }) => cx('block py-4 font-display text-[1.875rem] font-semibold tracking-[-0.03em]', isActive && 'text-mark-deep')}>{n.label}</NavLink></li>
                ))}
              </ul>
            </nav>
            <p className="t-label mt-8 text-stone-500">{t('nav.topics')}</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6">
              {repo.categories().map((c) => <li key={c.slug}><Link to={`/search?topic=${c.slug}`} className="block py-2.5 font-sans text-[1rem]">{cat(c.slug)}</Link></li>)}
            </ul>
            <div className="mt-8 grid gap-3">
              {user ? <Button to="/profile" variant="outline" size="lg" full>{t('nav.profile')}</Button> : <Button to="/login" variant="outline" size="lg" full icon={<LogIn className="h-4 w-4" aria-hidden />}>{t('nav.login')}</Button>}
              <Button to="/contribute" size="lg" full>{t('nav.contribute')}</Button>
            </div>
            <div className="mt-auto pt-10"><LanguageSwitcher inline /></div>
          </div>
        </div>
      )}
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </header>
  )
}
