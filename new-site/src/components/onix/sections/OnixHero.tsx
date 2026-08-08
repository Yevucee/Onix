'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LIVE_HOMEPAGE } from '@/data/live-site'

const SLIDES = [
  {
    title: 'Welcome to Onix Data Centres',
    body: LIVE_HOMEPAGE.hero.body,
    cta: { label: 'About Us', url: LIVE_HOMEPAGE.hero.ctaUrl },
  },
]

export function OnixHero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (SLIDES.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 6000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[current]

  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-[#3a3a3a]">
      {/* Dark overlay background — live uses slider with dark imagery */}
      <div className="absolute inset-0 bg-[#3a3a3a]" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="onix-content relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="max-w-3xl text-[40px] font-semibold leading-[1.2] text-white md:text-[40px]">{slide.title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-[22.4px] text-white">{slide.body}</p>
        <Link
          href={slide.cta.url}
          className="mt-8 inline-block border-2 border-white bg-transparent px-10 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[var(--onix-navy)]"
        >
          {slide.cta.label}
        </Link>
      </div>

      {SLIDES.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 text-white/70 hover:text-white"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-white/70 hover:text-white"
            aria-label="Next slide"
          >
            ›
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full ${i === current ? 'bg-white' : 'bg-white/40'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
