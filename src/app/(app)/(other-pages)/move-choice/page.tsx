'use client'

import { useMoveSearch } from '@/context/moveSearch'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import {
  ArrowRightIcon,
  BoltIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const MOVE_TYPE_LABELS: Record<string, string> = {
  light: 'Light Move',
  regular: 'Regular Move',
  premium: 'Premium Move',
}

const MoveChoiceContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    pickupLocation,
    dropoffLocation,
    moveType,
    setPickupLocation,
    setDropoffLocation,
    setMoveType,
    setIsInstantMove,
  } = useMoveSearch()

  // Read query params and update context
  useEffect(() => {
    const pickup = searchParams.get('pickup')
    const dropoff = searchParams.get('dropoff')
    const mt = searchParams.get('moveType')
    if (pickup) setPickupLocation(pickup)
    if (dropoff) setDropoffLocation(dropoff)
    if (mt) setMoveType(mt as any)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    router.prefetch('/add-listing/1')
    router.prefetch('/instant-move')
  }, [router])

  const handleInstantMove = () => {
    setIsInstantMove(true)
    router.push('/instant-move')
  }

  const handleBookLater = () => {
    setIsInstantMove(false)
    router.push('/add-listing/1')
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-3xl px-4 pt-10 pb-24 sm:pt-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
            <TruckIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            How would you like to move?
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Choose the option that best fits your needs
          </p>
        </div>

        {/* Move Summary Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 mb-8">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4">
            Your move details
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <MapPinIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Pickup</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {pickupLocation || 'Not specified'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <MapPinIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Drop-off</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {dropoffLocation || 'Not specified'}
                </p>
              </div>
            </div>
            {moveType && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <TruckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Move type</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {MOVE_TYPE_LABELS[moveType] || moveType}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Choice Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Instant Move Card */}
          <button
            onClick={handleInstantMove}
            className="group relative bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-primary-500 transition-all text-left"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                Fast
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
              <BoltIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Instant Move
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Need to move right now? We&apos;ll find a mover near you immediately.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                <ClockIcon className="w-4 h-4 text-amber-500" />
                Mover arrives in 15-30 min
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                <BoltIcon className="w-4 h-4 text-amber-500" />
                Real-time tracking
              </li>
            </ul>
            <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:translate-x-1 transition-transform">
              Get started
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </div>
          </button>

          {/* Book for Later Card */}
          <button
            onClick={handleBookLater}
            className="group relative bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-primary-500 transition-all text-left"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                Flexible
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4">
              <CalendarDaysIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Book for Later
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Plan ahead and schedule your move for a specific date and time.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                <CalendarDaysIcon className="w-4 h-4 text-primary-500" />
                Choose your preferred date
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                <ClockIcon className="w-4 h-4 text-primary-500" />
                Select arrival time window
              </li>
            </ul>
            <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:translate-x-1 transition-transform">
              Schedule move
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <ButtonSecondary href="/" className="px-8">
            Back to home
          </ButtonSecondary>
        </div>
      </div>
    </div>
  )
}

const MoveChoicePage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MoveChoiceContent />
    </Suspense>
  )
}

export default MoveChoicePage
