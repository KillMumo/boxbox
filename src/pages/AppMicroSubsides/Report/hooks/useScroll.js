/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

const useScroll = (scrollRef) => {
  const [pos, setPos] = useState([0, 0])

  useEffect(() => {
    function handleScroll(e) {
      setPos([scrollRef.current.scrollLeft, scrollRef.current.scrollTop])
    }
    scrollRef.current.addEventListener('scroll', handleScroll, false)
    return () => {
      scrollRef.current.removeEventListener('scroll', handleScroll, false)
    }
    // return scrollRef.current.removeEventListener('scroll', handleScroll, false)
  }, [scrollRef])

  return pos
}

export default useScroll
