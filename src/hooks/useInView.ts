import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(margin = '200px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: margin },
    )
    observer.observe(node)

    return () => observer.disconnect()
  }, [margin])

  return { ref, inView }
}
