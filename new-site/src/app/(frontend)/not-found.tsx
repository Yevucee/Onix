import Link from 'next/link'
import { Container, Section } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <Section className="min-h-[50vh]">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-brand)]">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mx-auto mt-4 max-w-lg text-[var(--color-muted)]">
          The page you requested does not exist or may have moved. Try the links below or return to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/">Home</Button>
          <Link href="/news" className="text-sm font-medium text-[var(--color-brand)] hover:underline">
            News & insights
          </Link>
          <Link href="/contact-us" className="text-sm font-medium text-[var(--color-brand)] hover:underline">
            Contact us
          </Link>
        </div>
      </Container>
    </Section>
  )
}
