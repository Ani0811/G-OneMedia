import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0)

    // Also use a timeout to guarantee it runs after the browser completes layout changes and page renders
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
