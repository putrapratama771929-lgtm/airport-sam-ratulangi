import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 → target on first viewport entry.
 * After the initial animation, subsequent target changes update instantly.
 */
export function CountUp({ target, duration = 800 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const hasAnimated = useRef(false)
  const animatingRef = useRef(false)

  // After initial animation, sync with target immediately
  useEffect(() => {
    if (hasAnimated.current && !animatingRef.current) setValue(target)
  }, [target])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      hasAnimated.current = true
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animatingRef.current = true
          io.disconnect()
          const t0 = target
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - (1 - p) ** 3 // cubic ease-out
            setValue(Math.round(eased * t0))
            if (p < 1) requestAnimationFrame(tick)
            else animatingRef.current = false
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <span ref={ref}>{value}</span>
}
