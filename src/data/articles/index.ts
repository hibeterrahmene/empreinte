import { issue1 } from './issue1'
import { issue2 } from './issue2'
import { issue3 } from './issue3'
import type { Article } from '@/types'

export const articles: Article[] = [...issue1, ...issue2, ...issue3]
