import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cx } from '@/lib/utils'

type Variant = 'primary' | 'dark' | 'outline' | 'outlineLight' | 'white' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: Variant
  size?: Size
  to?: string
  href?: string
  download?: boolean
  icon?: ReactNode
  arrow?: boolean
  full?: boolean
  className?: string
  external?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-mark-deep text-white border-mark-deep hover:bg-[#245C8C] hover:border-[#245C8C]',
  dark: 'bg-ink text-white border-ink hover:bg-night-soft hover:border-night-soft',
  outline: 'bg-transparent text-mark-deep border-mark-deep hover:bg-mark-deep hover:text-white',
  outlineLight: 'bg-transparent text-white border-white/70 hover:bg-white hover:text-ink',
  white: 'bg-white text-ink border-white hover:bg-cream hover:border-cream',
  ghost: 'bg-transparent text-ink border-transparent hover:bg-ink/5',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.75rem]',
  md: 'h-11 px-5 text-[0.8125rem]',
  lg: 'h-[3.25rem] px-7 text-[0.875rem]',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', full = false, extra = '') =>
  cx(
    'group inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded border font-sans font-semibold uppercase tracking-[0.06em] transition-[background-color,color,border-color,transform] duration-200 ease-editorial active:translate-y-px disabled:pointer-events-none disabled:opacity-50 rtl:tracking-normal',
    variants[variant],
    sizes[size],
    full && 'w-full',
    extra,
  )

export const Arrow = ({ className }: { className?: string }) => (
  <ArrowRight aria-hidden className={cx('h-4 w-4 shrink-0 transition-transform duration-200 ease-editorial group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5', className)} />
)

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', to, href, download, icon, arrow, full, className, external, children, type = 'button', 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const cls = buttonClass(variant, size, full, className)
  const content = (
    <>
      {icon}
      {children}
      {arrow && <Arrow />}
    </>
  )
  if (to) return <Link to={to} className={cls} aria-label={ariaLabel}>{content}</Link>
  if (href) return <a href={href} className={cls} aria-label={ariaLabel} {...(download ? { download: true } : {})} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{content}</a>
  return <button ref={ref} type={type} className={cls} aria-label={ariaLabel} {...rest}>{content}</button>
})
export default Button
