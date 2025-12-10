import { Metadata } from 'next'
import ListingPageClient from './ListingPageClient'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params

  return {
    title: `Move Details - ${handle}`,
    description: 'View the details of your scheduled move.',
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params

  return <ListingPageClient handle={handle} />
}

export default Page
