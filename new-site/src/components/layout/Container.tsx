import type { ReactNode } from 'react'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6 ${className}`}>{children}</div>
}

export function Section({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`py-12 md:py-16 ${className}`}>
      {children}
    </section>
  )
}
