'use client'

import Link from 'next/link'
import { LIVE_HOMEPAGE } from '@/data/live-site'

export function ServiceShowcase() {
  const items = LIVE_HOMEPAGE.serviceShowcase

  return (
    <section className="bg-white py-0">
      <div className="onix-container">
        <div className="grid gap-0 md:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="group flex flex-col items-center border border-[#e8e8e8] bg-white px-[30px] py-[50px] text-center shadow-[-1px_0_20px_rgba(0,0,0,0.11)] transition-all duration-500 hover:bg-[var(--onix-navy)]"
            >
              <h3
                className="font-[family-name:var(--font-montserrat)] text-[1.4em] font-semibold tracking-[2.5px] text-[var(--onix-navy)] transition-colors group-hover:text-[var(--onix-red)]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-[1.4] text-[var(--onix-body)] transition-colors group-hover:text-white/80">
                {item.body}
              </p>
              <span className="mt-7 inline-block bg-[var(--onix-navy)] px-4 py-2 text-[0.8em] font-medium tracking-[1px] text-[var(--onix-red)] transition-colors group-hover:bg-[var(--onix-red)] group-hover:text-white">
                Learn More
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
