'use client'

import { useMoveSearch } from '@/context/moveSearch'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import { Divider } from '@/shared/divider'
import { TruckIcon } from '@heroicons/react/24/outline'
import Form from 'next/form'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import PayWith from './PayWith'
import YourMove from './YourMove'

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

const Page = () => {
  const router = useRouter()
  
  const {
    moveType,
    moveDate,
    pickupStreetAddress,
    pickupLocation,
    dropoffStreetAddress,
    arrivalWindow,
    packingServiceLevel,
    additionalServices,
    storageWeeks,
    crewSize,
    vehicleType,
    inventory,
    customItems,
    coverPhoto,
  } = useMoveSearch()

  React.useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'instant',
    })
  }, [])

  // Calculate prices
  const basePrice = moveType === 'premium' ? 299 : moveType === 'regular' ? 199 : 99
  const packingPrice = packingServiceLevel === 'full' ? 250 : packingServiceLevel === 'unpacking' ? 350 : packingServiceLevel === 'partial' ? 150 : 0
  const servicesPrice = additionalServices.length * 50
  const storagePrice = storageWeeks * 30
  const subtotal = basePrice + packingPrice + servicesPrice + storagePrice
  const tax = Math.round(subtotal * 0.19) // 19% VAT
  const totalPrice = subtotal + tax

  const inventoryCount = Object.values(inventory).reduce((sum, qty) => sum + qty, 0) + customItems.length

  const handleSubmitForm = async (formData: FormData) => {
    const formObject = Object.fromEntries(formData.entries())
    console.log('Form submitted:', formObject)
    // Here you can handle the form submission, e.g., send it to an API
    router.push('/pay-done')
  }

  const renderSidebar = () => {
    return (
      <div className="flex w-full flex-col gap-y-6 border-neutral-200 px-0 sm:gap-y-8 sm:rounded-4xl sm:p-6 lg:border xl:p-8 dark:border-neutral-700">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="w-full shrink-0 sm:w-40">
            <div className="aspect-w-4 overflow-hidden rounded-2xl aspect-h-3 sm:aspect-h-4 bg-neutral-100 dark:bg-neutral-800">
              {coverPhoto ? (
                <Image
                  alt="Move preview"
                  fill
                  sizes="200px"
                  src={coverPhoto}
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <TruckIcon className="h-12 w-12 text-neutral-400" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-y-3 py-5 text-start sm:ps-5">
            <div>
              <span className="line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">
                {formatLabel(moveType)} Move · {formatDate(moveDate)}
              </span>
              <span className="mt-1 block text-base font-medium line-clamp-2">
                {pickupStreetAddress || pickupLocation || 'Pickup'} → {dropoffStreetAddress || 'Drop-off'}
              </span>
            </div>
            <p className="block text-sm text-neutral-500 dark:text-neutral-400">
              {inventoryCount} items · {crewSize ? `${crewSize} movers` : 'Crew TBD'} · {formatLabel(vehicleType)}
            </p>
            <Divider className="w-10!" />
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                {formatLabel(arrivalWindow)}
              </span>
            </div>
          </div>
        </div>

        <Divider className="block lg:hidden" />

        <DescriptionList>
          <DescriptionTerm>Base rate ({formatLabel(moveType)})</DescriptionTerm>
          <DescriptionDetails className="sm:text-right">€{basePrice.toFixed(2)}</DescriptionDetails>
          
          {packingPrice > 0 && (
            <>
              <DescriptionTerm>Packing service</DescriptionTerm>
              <DescriptionDetails className="sm:text-right">€{packingPrice.toFixed(2)}</DescriptionDetails>
            </>
          )}
          
          {servicesPrice > 0 && (
            <>
              <DescriptionTerm>Additional services ({additionalServices.length})</DescriptionTerm>
              <DescriptionDetails className="sm:text-right">€{servicesPrice.toFixed(2)}</DescriptionDetails>
            </>
          )}
          
          {storagePrice > 0 && (
            <>
              <DescriptionTerm>Storage ({storageWeeks} weeks)</DescriptionTerm>
              <DescriptionDetails className="sm:text-right">€{storagePrice.toFixed(2)}</DescriptionDetails>
            </>
          )}
          
          <DescriptionTerm>VAT (19%)</DescriptionTerm>
          <DescriptionDetails className="sm:text-right">€{tax.toFixed(2)}</DescriptionDetails>
          
          <DescriptionTerm className="font-semibold text-neutral-900 dark:text-white">Total</DescriptionTerm>
          <DescriptionDetails className="font-semibold sm:text-right text-primary-600">€{totalPrice.toFixed(2)}</DescriptionDetails>
        </DescriptionList>
      </div>
    )
  }

  const renderMain = () => {
    return (
      <Form
        action={handleSubmitForm}
        className="flex w-full flex-col gap-y-8 border-neutral-200 px-0 sm:rounded-4xl sm:border sm:p-6 xl:p-8 dark:border-neutral-700"
      >
        <h1 className="text-3xl font-semibold lg:text-4xl">Confirm and payment</h1>
        <Divider />
        <YourMove />
        <PayWith />
        <div>
          <ButtonPrimary type="submit" className="mt-10 text-base/6!">
            Confirm and pay €{totalPrice.toFixed(2)}
          </ButtonPrimary>
        </div>
      </Form>
    )
  }

  return (
    <main className="container mt-10 mb-24 flex flex-col gap-14 lg:mb-32 lg:flex-row lg:gap-10">
      <div className="w-full lg:w-3/5 xl:w-2/3">{renderMain()}</div>
      <Divider className="block lg:hidden" />
      <div className="grow">{renderSidebar()}</div>
    </main>
  )
}

export default Page
