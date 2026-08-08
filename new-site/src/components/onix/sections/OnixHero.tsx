'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LIVE_HOMEPAGE } from '@/data/live-site'

const SLIDES = [
  {
    title: 'Welcome to Onix Data Centres',
    body: LIVE_HOMEPAGE.hero.body,
    image: '/images/onix/hero/slide-1.jpg',
  },
  {
    title: 'Virtual Machines',
    body: "Maximise efficiency with VMs, offering direct access to Ghana's top networks.",
    image: '/images/onix/hero/slide-2.jpg',
  },
  {
    title: 'Managed Services',
    body: 'Boost IT reliability with our comprehensive Managed Services.',
    image: '/images/onix/hero/slide-3.jpg',
  },
  {
    title: 'Cyber Security',
    body: 'Defend against cyber threats with cutting-edge security measures.',
    image: '/images/onix/hero/slide-4.jpg',
  },
]

const CTA = { label: 'About Us', url: LIVE_HOMEPAGE.hero.ctaUrl }
const AUTOPLAY_MS = 6000

export function OnixHero() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [next])

  const slide = SLIDES[current]

  return (
    <section className="relative min-h-[60vh] overflow-hidden md:min-h-[650px]">
      {SLIDES.map((s, i) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-hidden={i !== current}
        >
          <Image src={s.image} alt="" fill priority={i === 0} className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/45" />
        </div>
      ))}

      <div className="onix-content relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center md:min-h-[650px]">
        <h1 className="max-w-3xl text-[40px] font-semibold leading-[1.07] text-white md:text-[45px] md:leading-[48px]">
          {slide.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-[22.4px] text-white">{slide.body}</p>
        <Link
          href={CTA.url}
          className="mt-8 inline-block bg-white px-10 py-3 text-[15px] font-normal text-[var(--onix-navy)] transition-colors hover:bg-white/90"
        >
          {CTA.label}
        </Link>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 p-2 text-3xl text-white/80 transition-colors hover:text-white"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 p-2 text-3xl text-white/80 transition-colors hover:text-white"
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
            className={`h-2.5 w-2.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
          />
        ))}
      </div>
    </section>
  )
}
