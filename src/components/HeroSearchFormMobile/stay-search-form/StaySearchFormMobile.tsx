'use client'

import T from '@/utils/getT'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import FieldPanelContainer from '../FieldPanelContainer'
import LocationInput from '../LocationInput'
import MoveTypeInput from '../MoveTypeInput'

type MoveTypeKey = 'light' | 'regular' | 'premium'

const MOVE_TYPE_LABELS: Record<MoveTypeKey, string> = {
  light: 'Light Move',
  regular: 'Regular Move',
  premium: 'Premium Move',
}

const StaySearchFormMobile = () => {
  const [fieldNameShow, setFieldNameShow] = useState<'pickupLocation' | 'dropoffLocation' | 'moveType'>('pickupLocation')
  const [pickupLocationInput, setPickupLocationInput] = useState('')
  const [dropoffLocationInput, setDropoffLocationInput] = useState('')
  const [moveType, setMoveType] = useState<MoveTypeKey | null>(null)
  const router = useRouter()

  const handleFormSubmit = (formData: FormData) => {
    const formDataEntries = Object.fromEntries(formData.entries())
    console.log('Form submitted', formDataEntries)

    const pickup = (formDataEntries['pickupLocation'] || '') as string
    const dropoff = (formDataEntries['dropoffLocation'] || '') as string
    const type = (formDataEntries['moveType'] || '') as string

    let url = '/move-choice'
    const params = new URLSearchParams()
    if (pickup) params.set('pickup', pickup)
    if (dropoff) params.set('dropoff', dropoff)
    if (type) params.set('moveType', type)
    const qs = params.toString()
    if (qs) url = url + `?${qs}`
    router.push(url)
  }

  return (
    <Form id="form-hero-search-form-mobile" action={handleFormSubmit} className="flex w-full flex-col gap-y-3">
      {/* PICKUP LOCATION */}
      <FieldPanelContainer
        isActive={fieldNameShow === 'pickupLocation'}
        headingOnClick={() => setFieldNameShow('pickupLocation')}
        headingTitle="From"
        headingValue={pickupLocationInput || 'Pickup location'}
      >
        <LocationInput
          defaultValue={pickupLocationInput}
          headingText="Where are you moving from?"
          imputName="pickupLocation"
          onChange={(value) => {
            setPickupLocationInput(value)
            setFieldNameShow('dropoffLocation')
          }}
        />
      </FieldPanelContainer>

      {/* DROP-OFF LOCATION */}
      <FieldPanelContainer
        isActive={fieldNameShow === 'dropoffLocation'}
        headingOnClick={() => setFieldNameShow('dropoffLocation')}
        headingTitle="To"
        headingValue={dropoffLocationInput || 'Drop-off location'}
      >
        <LocationInput
          defaultValue={dropoffLocationInput}
          headingText="Where are you moving to?"
          imputName="dropoffLocation"
          onChange={(value) => {
            setDropoffLocationInput(value)
            setFieldNameShow('moveType')
          }}
        />
      </FieldPanelContainer>

      {/* MOVE TYPE */}
      <FieldPanelContainer
        isActive={fieldNameShow === 'moveType'}
        headingOnClick={() => setFieldNameShow('moveType')}
        headingTitle="Move Type"
        headingValue={moveType ? MOVE_TYPE_LABELS[moveType] : 'Select type'}
      >
        <MoveTypeInput
          defaultValue={moveType}
          onChange={(value) => {
            setMoveType(value)
          }}
        />
      </FieldPanelContainer>
    </Form>
  )
}

export default StaySearchFormMobile
