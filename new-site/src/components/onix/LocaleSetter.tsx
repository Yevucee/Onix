'use client'

import { useEffect } from 'react'

/** Sets document lang for French routes (parent layout uses lang="en"). */
export function LocaleSetter({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = 'en'
    }
  }, [lang])
  return null
}
