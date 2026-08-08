import { LocaleSetter } from '@/components/onix/LocaleSetter'

export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocaleSetter lang="fr" />
      {children}
    </>
  )
}
