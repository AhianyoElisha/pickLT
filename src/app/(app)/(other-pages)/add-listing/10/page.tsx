import { redirect } from 'next/navigation'

// Step 10 has been merged into move-preview page
// This page now just redirects there
const Page = () => {
  redirect('/move-preview')
}

export default Page
