import type { Article, ArticleImage } from '@/types'
import { img } from '@/data/images'

const fallbacks = [img.sun, img.paintFacade, img.facadePoster, img.photoWindows, img.gardenPoster, img.paintSteps, img.photoSteps]

/** Image d'un article, avec repli sur un recadrage des illustrations du campus (choix stable par slug). */
export function articleImage(a: Article): ArticleImage {
  if (a.image) return a.image
  let h = 0
  for (const c of a.slug) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return { src: fallbacks[h % fallbacks.length], alt: '', position: '50% 50%' }
}
