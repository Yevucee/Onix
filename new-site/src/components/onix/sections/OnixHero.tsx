'use client'

import { useState, useEffect, useCallback } from 'react'
import { OnixButton } from '@/components/onix/OnixButton'

/** Production hero background — Elementor background_video_link on live homepage */
const HERO_VIDEO_ID = 'XNjRm7W4OvA'
const HERO_VIDEO_EMBED = `https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO_ID}&controls=0&rel=0&playsinline=1&showinfo=0&modestbranding=1&enablejsapi=1`

const SLIDES = [
  {
    title: 'Welcome to Onix Data Centres',
    body: 'Onix is the leading provider of Tier IV Colocation data centre services in Ghana. Our state-of-the-art facility is designed to meet the growing demands of businesses in Ghana and the region. Our carrier-neutral data centre ensures freedom of choice and maximum flexibility for our clients.',
    cta: { label: 'About Us', url: '/o-home/about-us' },
  },
  {
    title: 'Virtual Machines',
    body: "Maximise efficiency with VMs, offering direct access to Ghana's top networks.",
    cta: { label: 'Our Solutions', url: '/home/our-solutions' },
  },
  {
    title: 'Managed Services',
    body: 'Boost IT reliability with our comprehensive Managed Services.',
    cta: { label: 'Learn More', url: '/home/our-solutions' },
  },
  {
    title: 'Cyber Security',
    body: 'Defend against cyber threats with cutting-edge security measures.',
    cta: { label: 'Learn More', url: '/home/our-solutions' },
  },
]

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
    <section className="relative min-h-[500px] overflow-hidden md:min-h-[650px]">
      {/* Desktop: YouTube drone video background (live Elementor background video) */}
      <div className="absolute inset-0 hidden md:block" aria-hidden>
        <iframe
          src={HERO_VIDEO_EMBED}
          title="Onix Data Centre, Ghana, from Above."
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          tabIndex={-1}
        />
      </div>

      {/* Mobile: static drone poster (live hides desktop video on mobile) */}
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: 'url(/images/onix/hero/mobile-poster.jpg)' }}
        aria-hidden
      />

      <div className="absolute inset-0 bg-black/45" aria-hidden />

      <div className="onix-content relative z-10 flex min-h-[500px] flex-col items-center justify-center px-6 py-20 text-center md:min-h-[650px]">
        <h1 className="onix-heading-light max-w-3xl text-[40px] font-semibold leading-[1.07] md:text-[45px] md:leading-[48px]">
          {slide.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-[22.4px] text-white">{slide.body}</p>
        <OnixButton variant="solid-white" href={slide.cta.url} className="mt-8">
          {slide.cta.label}
        </OnixButton>
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
