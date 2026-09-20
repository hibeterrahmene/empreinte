import { useEffect, useState } from 'react'

/** Progression (0–1) de la lecture d'un élément à travers la fenêtre. */
export function useReadingProgress(target: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = target.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight * 0.6
      const done = -r.top + window.innerHeight * 0.2
      setP(Math.min(1, Math.max(0, total > 0 ? done / total : 0)))
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [target])
  return p
}
