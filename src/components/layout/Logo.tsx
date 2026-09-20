import { Link } from 'react-router-dom'
import empreinteDark from '@/assets/logos/empreinte-dark.png'
import empreinteLight from '@/assets/logos/empreinte-light.png'
import { cx } from '@/lib/utils'

/** Logo officiel (jamais recréé en texte). Ratio 525:98 préservé par width:auto. */
export default function Logo({ tone = 'dark', className, to = '/' }: { tone?: 'dark' | 'light'; className?: string; to?: string }) {
  return (
    <Link to={to} aria-label="L'Empreinte — home" className="inline-flex shrink-0 items-center">
      <img src={tone === 'dark' ? empreinteDark : empreinteLight} alt="L'Empreinte" width={525} height={98} className={cx('h-8 w-auto md:h-9', className)} />
    </Link>
  )
}
