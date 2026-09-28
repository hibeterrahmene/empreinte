import { issue1 } from './issue1'
import { issue2 } from './issue2'
import { withPhotos } from '../photos'
import type { Article } from '@/types'

export const articles: Article[] = withPhotos([...issue1, ...issue2])
