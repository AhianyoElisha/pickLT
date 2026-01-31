'use client'

import MapboxMap, { RouteInfo } from '@/components/MapboxMap'
import { useMoveSearch, Coordinates } from '@/context/moveSearch'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import Logo from '@/shared/Logo'
import {
  Call02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  DeliveryTruck01Icon,
  Message01Icon,
  StarIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

// Dummy mover data (will be replaced with real data from API later)
const DUMMY_MOVER = {
  id: 'mover-001',
  name: 'Michael Schmidt',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  rating: 4.9,
  totalMoves: 1247,
  vehicleType: 'Mercedes Sprinter',
  vehiclePlate: 'B-MS 4721',
  crewSize: 2,
  crewMembers: ['Michael Schmidt', 'Thomas Weber'],
  phone: '+49 170 1234567',
  yearsExperience: 8,
  languages: ['German', 'English'],
  specializations: ['Furniture', 'Fragile items', 'Piano'],
}

type SearchPhase = 'searching' | 'found' | 'arriving' | 'arrived'

// Helper functions for formatting
const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`
  }
  return `${Math.round(meters)} m`
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.ceil((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes} min`
}

const InstantMovePage = () => {
  const router = useRouter()
  const {
    pickupLocation,
    dropoffLocation,
    pickupCoordinates,
    dropoffCoordinates,
  } = useMoveSearch()

  // Debug logging
  useEffect(() => {
    console.log('InstantMovePage - Context values:', {
      pickupLocation,
      dropoffLocation,
      pickupCoordinates,
      dropoffCoordinates,
    })
  }, [pickupLocation, dropoffLocation, pickupCoordinates, dropoffCoordinates])

  const [phase, setPhase] = useState<SearchPhase>('searching')
  const [searchProgress, setSearchProgress] = useState(0)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [moverEtaMinutes, setMoverEtaMinutes] = useState(12) // Mover's ETA to pickup
  const [moverDistanceKm, setMoverDistanceKm] = useState(2.4) // Mover's distance to pickup

  // Calculate mover starting position (offset from pickup)
  const [moverCoords, setMoverCoords] = useState<Coordinates | null>(null)

  // Initialize mover position when pickup coordinates are available
  useEffect(() => {
    if (pickupCoordinates && !moverCoords) {
      setMoverCoords({
        latitude: pickupCoordinates.latitude + 0.015,
        longitude: pickupCoordinates.longitude - 0.02,
      })
    }
  }, [pickupCoordinates, moverCoords])

  // Handle route calculation callback
  const handleRouteCalculated = useCallback((info: RouteInfo) => {
    setRouteInfo(info)
  }, [])

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
    if ((phase === 'found' || phase === 'arriving') && pickupCoordinates && moverCoords) {
      const interval = setInterval(() => {
        setMoverEtaMinutes((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setPhase('arrived')
            return 0
          }
          return prev - 1
        })
        setMoverDistanceKm((prev) => Math.max(0, prev - 0.2))
        
        // Move the mover closer to pickup
        setMoverCoords((prev) => {
          if (!prev || !pickupCoordinates) return prev
          return {
            latitude: prev.latitude + (pickupCoordinates.latitude - prev.latitude) * 0.15,
            longitude: prev.longitude + (pickupCoordinates.longitude - prev.longitude) * 0.15,
          }
        })
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [phase, pickupCoordinates, moverCoords])

  // Auto transition to arriving phase
  useEffect(() => {
    if (phase === 'found') {
      const timeout = setTimeout(() => setPhase('arriving'), 2000)
      return () => clearTimeout(timeout)
    }
  }, [phase])

  // Set mover at pickup when arrived
  useEffect(() => {
    if (phase === 'arrived' && pickupCoordinates) {
      setMoverCoords(pickupCoordinates)
    }
  }, [phase, pickupCoordinates])

  const handleCancel = () => {
    router.push('/move-choice')
  }

  const handleCallMover = () => {
    window.open(`tel:${DUMMY_MOVER.phone}`)
  }

  const handleMessageMover = () => {
    alert('Chat feature coming soon!')
  }

  const renderSearchingOverlay = () => (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 mx-4 max-w-sm w-full shadow-xl">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Logo className="w-20 sm:w-24" />
        </div>

        {/* Animated search indicator */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-700" />
          <div 
            className="absolute inset-0 rounded-full border-2 border-neutral-900 border-t-transparent dark:border-white animate-spin"
            style={{ animationDuration: '1s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <HugeiconsIcon
              icon={DeliveryTruck01Icon}
              size={24}
              strokeWidth={1.5}
              className="text-neutral-700 dark:text-neutral-200"
            />
          </div>
        </div>
        
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 text-center">
          Finding your mover...
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center text-sm mb-6">
          Looking for available movers near you
        </p>

        {/* Progress bar */}
        <div className="w-full mb-6">
          <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neutral-900 dark:bg-white transition-all duration-300 ease-out"
              style={{ width: `${Math.min(searchProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2">
            {Math.round(Math.min(searchProgress, 100))}%
          </p>
        </div>

        <ButtonSecondary onClick={handleCancel} className="w-full">
          Cancel search
        </ButtonSecondary>
      </div>
    </div>
  )

  const renderMoverCard = () => (
    <div className="rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-800/95 overflow-hidden shadow-lg">
      {/* Mover Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
              <Image
                src={DUMMY_MOVER.photo}
                alt={DUMMY_MOVER.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {DUMMY_MOVER.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <HugeiconsIcon
                icon={StarIcon}
                size={12}
                strokeWidth={1.5}
                className="text-neutral-900 dark:text-white fill-current"
              />
              <span className="text-xs font-medium text-neutral-900 dark:text-white">
                {DUMMY_MOVER.rating}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                · {DUMMY_MOVER.totalMoves} moves
              </span>
            </div>
          </div>
          {/* ETA Badge */}
          {phase !== 'arrived' && (
            <div className="text-right shrink-0">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {moverEtaMinutes} min
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {moverDistanceKm.toFixed(1)} km away
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Arrived Banner */}
      {phase === 'arrived' && (
        <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={20}
              strokeWidth={1.5}
              className="text-neutral-900 dark:text-white shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Your mover has arrived!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Info */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
          <HugeiconsIcon
            icon={DeliveryTruck01Icon}
            size={18}
            strokeWidth={1.5}
            className="text-neutral-600 dark:text-neutral-300"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {DUMMY_MOVER.vehicleType}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {DUMMY_MOVER.vehiclePlate} · {DUMMY_MOVER.crewSize} crew
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex gap-2">
        <ButtonSecondary onClick={handleCallMover} className="flex-1 !py-2">
          <HugeiconsIcon icon={Call02Icon} size={16} strokeWidth={1.5} className="mr-1.5" />
          Call
        </ButtonSecondary>
        <ButtonSecondary onClick={handleMessageMover} className="flex-1 !py-2">
          <HugeiconsIcon icon={Message01Icon} size={16} strokeWidth={1.5} className="mr-1.5" />
          Message
        </ButtonSecondary>
      </div>
    </div>
  )

  const renderLocationSummary = () => (
    <div className="rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-sm p-3 dark:border-neutral-700 dark:bg-neutral-800/95 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
          <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600" />
          <div className="w-2 h-2 rounded-full border-2 border-neutral-900 dark:border-white" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Pickup</p>
            <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
              {pickupLocation || 'Select pickup location'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Drop-off</p>
            <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
              {dropoffLocation || 'Select drop-off location'}
            </p>
          </div>
        </div>
        {/* Route info badge */}
        {routeInfo && (
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              {formatDistance(routeInfo.distance)}
            </p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {formatDuration(routeInfo.duration)}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // Check if we have valid coordinates
  const hasValidCoordinates = pickupCoordinates && dropoffCoordinates

  // Show error state if no coordinates are available
  if (!hasValidCoordinates && phase !== 'searching') {
    return (
      <div className="fixed inset-0 bg-white dark:bg-neutral-900 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <Logo className="w-24 mx-auto mb-6" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            Missing location details
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Please select your pickup and drop-off locations to continue.
          </p>
          <ButtonPrimary href="/move-choice" className="w-full">
            Go back
          </ButtonPrimary>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
      {/* Full-screen Map */}
      <div className="absolute inset-0">
        <MapboxMap
          pickupCoordinates={pickupCoordinates || undefined}
          dropoffCoordinates={dropoffCoordinates || undefined}
          moverCoordinates={phase !== 'searching' ? moverCoords || undefined : undefined}
          showRoute={true}
          onRouteCalculated={handleRouteCalculated}
          className="w-full h-full"
        />
      </div>

      {/* Searching Overlay */}
      {phase === 'searching' && renderSearchingOverlay()}

      {/* Top Bar - Location Summary & Close Button */}
      {phase !== 'searching' && (
        <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-safe">
          <div className="mx-auto max-w-lg flex items-start gap-3">
            <div className="flex-1">
              {renderLocationSummary()}
            </div>
            <button
              onClick={handleCancel}
              className="p-2.5 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-800 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 transition"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={20}
                strokeWidth={1.5}
                className="text-neutral-700 dark:text-neutral-300"
              />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Panel - Mover Card & Actions */}
      {phase !== 'searching' && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-safe">
          <div className="mx-auto max-w-lg space-y-3">
            {renderMoverCard()}
            
            {/* Action Button */}
            {phase !== 'arrived' ? (
              <ButtonSecondary onClick={handleCancel} className="w-full shadow-lg">
                Cancel move
              </ButtonSecondary>
            ) : (
              <ButtonPrimary 
                href={`/checkout${routeInfo ? `?distance=${routeInfo.distance}&duration=${routeInfo.duration}` : ''}`} 
                className="w-full shadow-lg"
              >
                Proceed to checkout
              </ButtonPrimary>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InstantMovePage
