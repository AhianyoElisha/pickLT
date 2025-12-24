'use client'

import { useMoveSearch } from '@/context/moveSearch'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  TruckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Dummy mover data
const DUMMY_MOVER = {
  id: 'mover-001',
  name: 'Michael Schmidt',
  photo: '/images/avatars/Image-1.png',
  rating: 4.9,
  totalMoves: 1247,
  vehicleType: 'Mercedes Sprinter',
  vehiclePlate: 'B-MS 4721',
  crewSize: 2,
  crewMembers: ['Michael Schmidt', 'Thomas Weber'],
  etaMinutes: 12,
  phone: '+49 170 1234567',
  yearsExperience: 8,
  languages: ['German', 'English'],
  specializations: ['Furniture', 'Fragile items', 'Piano'],
}

type SearchPhase = 'searching' | 'found' | 'arriving' | 'arrived'

const InstantMovePage = () => {
  const router = useRouter()
  const {
    pickupLocation,
    dropoffLocation,
    moveType,
  } = useMoveSearch()

  const [phase, setPhase] = useState<SearchPhase>('searching')
  const [searchProgress, setSearchProgress] = useState(0)
  const [etaMinutes, setEtaMinutes] = useState(DUMMY_MOVER.etaMinutes)
  const [moverDistance, setMoverDistance] = useState(2.4) // km

  // Simulate search progress
  useEffect(() => {
    if (phase === 'searching') {
      const interval = setInterval(() => {
        setSearchProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setPhase('found')
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [phase])

  // Simulate mover approaching
  useEffect(() => {
    if (phase === 'found' || phase === 'arriving') {
      const interval = setInterval(() => {
        setEtaMinutes((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setPhase('arrived')
            return 0
          }
          return prev - 1
        })
        setMoverDistance((prev) => Math.max(0, prev - 0.2))
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [phase])

  // Auto transition to arriving phase
  useEffect(() => {
    if (phase === 'found') {
      const timeout = setTimeout(() => setPhase('arriving'), 2000)
      return () => clearTimeout(timeout)
    }
  }, [phase])

  const handleCancel = () => {
    router.push('/move-choice')
  }

  const handleCallMover = () => {
    window.open(`tel:${DUMMY_MOVER.phone}`)
  }

  const handleMessageMover = () => {
    // In a real app, this would open a chat
    alert('Chat feature coming soon!')
  }

  const renderSearchingPhase = () => (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated search indicator */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700" />
        <div 
          className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"
          style={{ animationDuration: '1s' }}
        />
        <div className="absolute inset-4 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
          <TruckIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
        Finding your mover...
      </h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-center mb-6">
        Looking for available movers near you
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-8">
        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(searchProgress, 100)}%` }}
          />
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-2">
          {Math.round(Math.min(searchProgress, 100))}%
        </p>
      </div>

      <ButtonSecondary onClick={handleCancel}>
        Cancel search
      </ButtonSecondary>
    </div>
  )

  const renderMoverCard = () => (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Mover Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
              <Image
                src={DUMMY_MOVER.photo}
                alt={DUMMY_MOVER.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {DUMMY_MOVER.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <StarIconSolid className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {DUMMY_MOVER.rating}
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                ({DUMMY_MOVER.totalMoves} moves)
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {DUMMY_MOVER.yearsExperience} years experience
            </p>
          </div>
        </div>
      </div>

      {/* ETA Section */}
      {phase !== 'arrived' && (
        <div className="px-6 py-4 bg-primary-50 dark:bg-primary-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                {phase === 'found' ? 'Mover found!' : 'Arriving in'}
              </p>
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                {etaMinutes} min
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Distance</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {moverDistance.toFixed(1)} km
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Arrived Banner */}
      {phase === 'arrived' && (
        <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">
                Your mover has arrived!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                They&apos;re waiting at your pickup location
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle & Crew Info */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
            <TruckIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {DUMMY_MOVER.vehicleType}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {DUMMY_MOVER.vehiclePlate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
            <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
              {DUMMY_MOVER.crewSize}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              Crew members
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {DUMMY_MOVER.crewMembers.join(', ')}
            </p>
          </div>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-2 pt-2">
          {DUMMY_MOVER.specializations.map((spec) => (
            <span
              key={spec}
              className="px-3 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 flex gap-3">
        <ButtonSecondary onClick={handleCallMover} className="flex-1">
          <PhoneIcon className="w-5 h-5 mr-2" />
          Call
        </ButtonSecondary>
        <ButtonSecondary onClick={handleMessageMover} className="flex-1">
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
          Message
        </ButtonSecondary>
      </div>
    </div>
  )

  const renderMap = () => (
    <div className="relative h-64 md:h-80 lg:h-96 bg-neutral-200 dark:bg-neutral-700 rounded-2xl overflow-hidden mb-6">
      {/* Placeholder map - in production, use Google Maps or Mapbox */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800">
        {/* Simulated map grid */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-neutral-400 dark:border-neutral-600"
              style={{ top: `${i * 10}%` }}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-neutral-400 dark:border-neutral-600"
              style={{ left: `${i * 10}%` }}
            />
          ))}
        </div>

        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full">
          <line
            x1="30%"
            y1="70%"
            x2="70%"
            y2="30%"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 4"
            className="text-primary-500"
          />
        </svg>

        {/* Pickup marker */}
        <div className="absolute left-[30%] top-[70%] -translate-x-1/2 -translate-y-full">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <MapPinIcon className="w-5 h-5 text-white" />
            </div>
            <div className="mt-1 px-2 py-0.5 bg-white dark:bg-neutral-800 rounded text-xs font-medium shadow">
              Pickup
            </div>
          </div>
        </div>

        {/* Dropoff marker */}
        <div className="absolute left-[70%] top-[30%] -translate-x-1/2 -translate-y-full">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <MapPinIcon className="w-5 h-5 text-white" />
            </div>
            <div className="mt-1 px-2 py-0.5 bg-white dark:bg-neutral-800 rounded text-xs font-medium shadow">
              Drop-off
            </div>
          </div>
        </div>

        {/* Mover marker (animated) */}
        {(phase === 'found' || phase === 'arriving') && (
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
            style={{ 
              left: `${30 + (100 - searchProgress) * 0.3}%`, 
              top: `${70 - (100 - searchProgress) * 0.3}%` 
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              {/* Pulse animation */}
              <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-30" />
            </div>
          </div>
        )}

        {/* Arrived state - mover at pickup */}
        {phase === 'arrived' && (
          <div className="absolute left-[30%] top-[70%] -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map overlay gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent" />
    </div>
  )

  const renderLocationSummary = () => (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="w-0.5 h-8 bg-neutral-300 dark:bg-neutral-600" />
          <div className="w-3 h-3 rounded-full bg-red-500" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Pickup</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              {pickupLocation || 'Berlin, Germany'}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Drop-off</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              {dropoffLocation || 'Munich, Germany'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
              {phase === 'searching' ? 'Finding mover...' : 
               phase === 'arrived' ? 'Mover arrived!' : 'Your mover is on the way'}
            </h1>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition"
            >
              <XMarkIcon className="w-6 h-6 text-neutral-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {phase === 'searching' ? (
          renderSearchingPhase()
        ) : (
          <>
            {renderMap()}
            {renderLocationSummary()}
            {renderMoverCard()}
            
            {/* Cancel/Complete Actions */}
            <div className="mt-6 flex gap-3">
              {phase !== 'arrived' ? (
                <ButtonSecondary onClick={handleCancel} className="flex-1">
                  Cancel move
                </ButtonSecondary>
              ) : (
                <ButtonPrimary href="/checkout" className="flex-1">
                  Proceed to checkout
                </ButtonPrimary>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default InstantMovePage
