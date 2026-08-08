import Link from 'next/link'

type Crumb = { label: string; href?: string }

export function OnixBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 text-sm text-[var(--onix-muted)]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-[var(--onix-red)]">
                {item.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? 'text-[var(--onix-heading)]' : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
