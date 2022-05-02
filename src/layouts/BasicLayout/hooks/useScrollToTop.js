import { useEffect } from 'react'

const useScrollToTop = (location) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
}

export default useScrollToTop
