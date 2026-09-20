import { useEffect } from 'react'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — L'Empreinte` : "L'Empreinte — ESTIN journal"
  }, [title])
}
