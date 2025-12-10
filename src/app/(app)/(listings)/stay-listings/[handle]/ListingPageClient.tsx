'use client'

import { useMoveSearch } from '@/context/moveSearch'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MoveDetailPage from './MoveDetailPage'

interface ListingPageClientProps {
  handle: string
}

const ListingPageClient = ({ handle }: ListingPageClientProps) => {
  const router = useRouter()
  const { getMoveByHandle } = useMoveSearch()
  const [isLoading, setIsLoading] = useState(true)
  const [isMove, setIsMove] = useState(false)

  useEffect(() => {
    const move = getMoveByHandle(handle)
    if (move) {
      setIsMove(true)
    }
    setIsLoading(false)
  }, [handle, getMoveByHandle])

  // Redirect effect - needs to be before any conditional returns
  useEffect(() => {
    if (!isMove && !isLoading) {
      router.push('/add-listing/1')
    }
  }, [isMove, isLoading, router])

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-neutral-500">Loading...</div>
      </div>
    )
  }

  // If it's a move, show move details
  if (isMove) {
    return <MoveDetailPage handle={handle} />
  }

  // Redirecting state
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-neutral-500">Redirecting...</div>
    </div>
  )
}

export default ListingPageClient
