'use client'

import { useEffect, useRef, useState } from 'react'
import { LIVE_HOMEPAGE } from '@/data/live-site'

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState('0')
  const numericTarget = parseFloat(value.replace(/[^0-9.]/g, ''))
  const hasDecimal = value.includes('.')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const start = 0
        const duration = 2000
        const startTime = performance.now()
        const animate = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const current = start + (numericTarget - start) * progress
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
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export function StatsRow() {
  const stats = LIVE_HOMEPAGE.whoWeAre.stats

  return (
    <section className="bg-[var(--onix-stats-bg)] py-4">
      <div className="onix-container">
        <div className="grid gap-0 md:grid-cols-3">
          {stats.map((stat) => {
            const suffix = stat.value.includes('%') ? '%' : stat.value.includes('+') ? '+' : ''
            const num = stat.value.replace(/[%+]/g, '')
            return (
              <div
                key={stat.label}
                className="m-[17px] bg-white px-0 py-[27px] pb-9 text-center shadow-[1px_1px_6px_rgba(0,0,0,0.11)] transition-all hover:bg-[#ececec]"
              >
                <p className="font-[family-name:var(--font-montserrat)] text-5xl font-semibold text-[var(--onix-red)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <AnimatedCounter value={num} suffix={suffix} />
                </p>
                <p className="mt-2 text-base leading-[26px] text-[var(--onix-body)]">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
