'use client'

import { useEffect, useRef, useState } from 'react'

export function OnixAnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const numericTarget = parseFloat(value.replace(/[^0-9.]/g, ''))
  const suffix = value.includes('%') ? '%' : value.includes('+') ? '+' : ''
  const num = value.replace(/[%+]/g, '')
  const hasDecimal = num.includes('.')

  useEffect(() => {
    const el = ref.current
    if (!el || Number.isNaN(numericTarget)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const duration = 2000
        const startTime = performance.now()
        const animate = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const current = numericTarget * progress
          setDisplay(hasDecimal ? current.toFixed(2) : Math.round(current).toString())
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
        observer.disconnect()
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [numericTarget, hasDecimal])

  return (
    <div className="m-[17px] px-0 py-[27px] pb-9 text-center">
      <p className="text-5xl font-semibold text-[var(--onix-red)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <span ref={ref}>
          {display}
          {suffix}
        </span>
      </p>
      <p className="mt-2 text-base leading-[26px] text-[var(--onix-body)]">{label}</p>
    </div>
  )
}
