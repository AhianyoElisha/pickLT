'use client'

import { useMoveSearch } from '@/context/moveSearch'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const YourMove = () => {
  const {
    moveDate,
    arrivalWindow,
    pickupStreetAddress,
    pickupLocation,
    pickupApartmentUnit,
    floorLevel,
    dropoffStreetAddress,
    dropoffApartmentUnit,
    dropoffFloorLevel,
    contactInfo,
  } = useMoveSearch()

  return (
    <div>
      <h3 className="text-2xl font-semibold">Your move</h3>
      <div className="z-10 mt-6 flex flex-col divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700">
        {/* Move Date & Time */}
        <Link
          href="/add-listing/6"
          className="flex flex-1 justify-between gap-x-5 p-5 text-start hover:bg-neutral-50 focus-visible:outline-hidden dark:hover:bg-neutral-800"
        >
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Move date & time</span>
            <span className="mt-1.5 text-lg font-semibold">
              {formatDate(moveDate)}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {formatLabel(arrivalWindow)} arrival
            </span>
          </div>
          <PencilSquareIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
        </Link>

        {/* Pickup Location */}
        <Link
          href="/add-listing/2"
          className="flex flex-1 justify-between gap-x-5 p-5 text-start hover:bg-neutral-50 focus-visible:outline-hidden dark:hover:bg-neutral-800"
        >
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Pickup address</span>
            <span className="mt-1.5 text-lg font-semibold">
              {pickupStreetAddress || pickupLocation || 'Not specified'}
              {pickupApartmentUnit && `, Unit ${pickupApartmentUnit}`}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Floor {floorLevel || 'N/A'}
            </span>
          </div>
          <PencilSquareIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
        </Link>

        {/* Drop-off Location */}
        <Link
          href="/add-listing/3"
          className="flex flex-1 justify-between gap-x-5 p-5 text-start hover:bg-neutral-50 focus-visible:outline-hidden dark:hover:bg-neutral-800"
        >
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Drop-off address</span>
            <span className="mt-1.5 text-lg font-semibold">
              {dropoffStreetAddress || 'Not specified'}
              {dropoffApartmentUnit && `, Unit ${dropoffApartmentUnit}`}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Floor {dropoffFloorLevel || 'N/A'}
            </span>
          </div>
          <PencilSquareIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
        </Link>

        {/* Contact */}
        <Link
          href="/add-listing/9"
          className="flex flex-1 justify-between gap-x-5 p-5 text-start hover:bg-neutral-50 focus-visible:outline-hidden dark:hover:bg-neutral-800"
        >
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Contact information</span>
            <span className="mt-1.5 text-lg font-semibold">
              {contactInfo.fullName || 'Not provided'}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {contactInfo.email || 'No email'} · {contactInfo.phoneNumber || 'No phone'}
            </span>
          </div>
          <PencilSquareIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
        </Link>
      </div>

      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Click on any section to edit your move details.
      </p>

      {/* Hidden fields for form data */}
      <input type="hidden" name="moveDate" value={moveDate || ''} />
      <input type="hidden" name="pickupAddress" value={pickupStreetAddress || pickupLocation || ''} />
      <input type="hidden" name="dropoffAddress" value={dropoffStreetAddress || ''} />
      <input type="hidden" name="contactName" value={contactInfo.fullName || ''} />
      <input type="hidden" name="contactEmail" value={contactInfo.email || ''} />
      <input type="hidden" name="contactPhone" value={contactInfo.phoneNumber || ''} />
    </div>
  )
}

export default YourMove
