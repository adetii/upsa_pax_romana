import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop({ behavior = 'smooth' }) {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    // If there is a hash, try to scroll to the element
    if (hash) {
      const id = hash.slice(1)
      const el = document.getElementById(id)
      if (el) {
        try {
          el.scrollIntoView({ behavior, block: 'start' })
        } catch {
          el.scrollIntoView()
        }
        return
      }
    }

    const scrollEl = document.scrollingElement || document.documentElement || document.body
    try {
      scrollEl.scrollTo({ top: 0, left: 0, behavior })
    } catch {
      // Fallback for older browsers
      scrollEl.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [pathname, search, hash, behavior])

  return null
}