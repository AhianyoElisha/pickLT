'use client'

import { useMoveSearch, StoredMove } from '@/context/moveSearch'
import { Badge } from '@/shared/Badge'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import { Divider } from '@/shared/divider'
import T from '@/utils/getT'
import { HomeIcon, TruckIcon, CalendarIcon, CubeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

// Helper to format labels
const formatLabel = (value: string | null | undefined): string => {
  if (!value) return 'Not specified'
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'Not selected'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const PayDoneContent = () => {
  const searchParams = useSearchParams()
  const handle = searchParams.get('handle')
  const { getMoveByHandle } = useMoveSearch()
  const [move, setMove] = useState<StoredMove | undefined>(undefined)

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'instant',
    })
  }, [])

  useEffect(() => {
    if (handle) {
      const foundMove = getMoveByHandle(handle)
      setMove(foundMove)
    }
  }, [handle, getMoveByHandle])

  const pickupDisplay = move?.pickupStreetAddress || move?.pickupLocation || 'Pickup location'
  const dropoffDisplay = move?.dropoffStreetAddress || 'Drop-off location'

  return (
    <main className="container mt-10 mb-24 sm:mt-16 lg:mb-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-y-12 px-0 sm:rounded-2xl sm:p-6 xl:p-8">
        <h1 className="text-4xl font-semibold sm:text-5xl">{T['common']['Congratulation']} 🎉</h1>
        <Divider />

        <div>
          <h3 className="text-2xl font-semibold">Your Move Booking</h3>
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center">
            <div className="w-full shrink-0 sm:w-40">
              <div className="aspect-w-4 overflow-hidden rounded-2xl aspect-h-3 sm:aspect-h-4 bg-neutral-100 dark:bg-neutral-800">
                {move?.coverPhoto ? (
                  <Image
                    fill
                    alt="Move preview"
                    className="object-cover"
                    src={move.coverPhoto}
                    sizes="200px"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <TruckIcon className="h-12 w-12 text-neutral-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-3 pt-5 sm:px-5 sm:pb-5">
              <div>
                <span className="line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {formatLabel(move?.moveType)} Move · {formatDate(move?.moveDate || null)}
                </span>
                <span className="mt-1 block text-base font-medium sm:text-lg">
                  {pickupDisplay.split(',')[0]} → {dropoffDisplay.split(',')[0]}
                </span>
              </div>
              <span className="block text-sm text-neutral-500 dark:text-neutral-400">
                {move?.inventoryCount || 0} items · {move?.crewSize ? `${move.crewSize} movers` : 'Crew TBD'} · {formatLabel(move?.vehicleType)}
              </span>
              <Divider className="w-10!" />
              <Badge className='w-fit' color="yellow">Pending</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-neutral-200 rounded-3xl border border-neutral-200 text-neutral-500 sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-neutral-700 dark:border-neutral-700 dark:text-neutral-400">
          <div className="flex flex-1 gap-x-4 p-5">
            <CalendarIcon className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-400">Move Date</span>
              <span className="mt-1.5 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {formatDate(move?.moveDate || null)}
              </span>
            </div>
          </div>
          <div className="flex flex-1 gap-x-4 p-5">
            <CubeIcon className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-400">Items</span>
              <span className="mt-1.5 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {move?.inventoryCount || 0} Items
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">Booking Details</h3>
          <DescriptionList className="mt-5">
            <DescriptionTerm>Booking code</DescriptionTerm>
            <DescriptionDetails className="font-mono">{move?.bookingCode || 'N/A'}</DescriptionDetails>
            <DescriptionTerm>Paid on</DescriptionTerm>
            <DescriptionDetails>
              {move?.paidAt 
                ? new Date(move.paidAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </DescriptionDetails>
            <DescriptionTerm>Total</DescriptionTerm>
            <DescriptionDetails className="text-primary-600 font-semibold">
              €{move?.totalPrice?.toFixed(2) || '0.00'}
            </DescriptionDetails>
            <DescriptionTerm>Payment method</DescriptionTerm>
            <DescriptionDetails>Credit card</DescriptionDetails>
          </DescriptionList>
        </div>

        <div className="flex flex-wrap gap-4">
          <ButtonPrimary href="/">
            <HomeIcon className="size-5" />
            Back to Home
          </ButtonPrimary>
          {move && (
            <ButtonPrimary href={`/stay-listings/${move.handle}`} className="bg-neutral-800 hover:bg-neutral-700">
              <MapPinIcon className="size-5" />
              View Move Details
            </ButtonPrimary>
          )}
        </div>
      </div>
    </main>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading...</div>}>
      <PayDoneContent />
    </Suspense>
  )
}

export default Page
