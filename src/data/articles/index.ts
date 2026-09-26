import { issue1 } from './issue1'
import { issue2 } from './issue2'
import type { Article } from '@/types'

export const articles: Article[] = [...issue1, ...issue2]
