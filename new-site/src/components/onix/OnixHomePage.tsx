import { OnixHero } from './sections/OnixHero'
import { WhoWeAre } from './sections/WhoWeAre'
import { StatsRow } from './sections/StatsRow'
import { SolutionsSection, InfrastructureSection } from './sections/SolutionsSection'
import { LatestNews } from './sections/LatestNews'
import { ContactCTA } from './sections/ContactCTA'
import type { Article, Media } from '@/payload-types'

type ArticleDoc = Pick<Article, 'id' | 'title' | 'slug' | 'excerpt' | 'publishedAt'> & {
  featuredImage?: number | Media | null
}

export function OnixHomePage({ articles }: { articles: ArticleDoc[] }) {
  return (
    <>
      <OnixHero />
      <WhoWeAre />
      <StatsRow />
      <SolutionsSection />
      <InfrastructureSection />
      <LatestNews articles={articles} />
      <ContactCTA />
    </>
  )
}
