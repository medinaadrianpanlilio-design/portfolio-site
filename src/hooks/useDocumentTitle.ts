import { useEffect } from 'react'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} — Adrian Medina`
      : 'Adrian Medina — Software Engineer'
  }, [title])
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
