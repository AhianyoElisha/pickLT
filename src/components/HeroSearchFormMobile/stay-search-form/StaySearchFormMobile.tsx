'use client'

import T from '@/utils/getT'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import FieldPanelContainer from '../FieldPanelContainer'
import LocationInput from '../LocationInput'
import SingleDateInput from '../SingleDateInput'
import MoveTypeInput from '../MoveTypeInput'

type MoveTypeKey = 'light' | 'regular' | 'premium'

const MOVE_TYPE_LABELS: Record<MoveTypeKey, string> = {
  light: 'Light Move',
  regular: 'Regular Move',
  premium: 'Premium Move',
}

const StaySearchFormMobile = () => {
  const [fieldNameShow, setFieldNameShow] = useState<'location' | 'dates' | 'moveType'>('location')
  const [locationInput, setLocationInput] = useState('')
  const [moveDate, setMoveDate] = useState<Date | null>(null)
  const [moveType, setMoveType] = useState<MoveTypeKey | null>(null)
  const router = useRouter()

  const handleFormSubmit = (formData: FormData) => {
    const formDataEntries = Object.fromEntries(formData.entries())
    console.log('Form submitted', formDataEntries)

    const location = (formDataEntries['pickupLocation'] || '') as string
    const date = (formDataEntries['moveDate'] || '') as string
    const type = (formDataEntries['moveType'] || '') as string

    let url = '/add-listing/1'
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (date) params.set('moveDate', date)
    if (type) params.set('moveType', type)
    const qs = params.toString()
    if (qs) url = url + `?${qs}`
    router.push(url)
  }

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return T['HeroSearchForm']['Add dates']
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <Form id="form-hero-search-form-mobile" action={handleFormSubmit} className="flex w-full flex-col gap-y-3">
      {/* PICKUP LOCATION */}
      <FieldPanelContainer
        isActive={fieldNameShow === 'location'}
        headingOnClick={() => setFieldNameShow('location')}
        headingTitle={T['HeroSearchForm']['Where']}
        headingValue={locationInput || 'Pickup location'}
      >
        <LocationInput
          defaultValue={locationInput}
          headingText="Where are you moving from?"
          imputName="pickupLocation"
          onChange={(value) => {
            setLocationInput(value)
            setFieldNameShow('dates')
          }}
        />
      </FieldPanelContainer>

      {/* MOVE DATE (Single Date) */}
      <FieldPanelContainer
        isActive={fieldNameShow === 'dates'}
        headingOnClick={() => setFieldNameShow('dates')}
        headingTitle={T['HeroSearchForm']['When']}
        headingValue={formatDateDisplay(moveDate)}
      >
        <SingleDateInput
          defaultDate={moveDate}
          headingText="When is your move?"
          inputName="moveDate"
          onChange={(date) => {
            setMoveDate(date)
            if (date) setFieldNameShow('moveType')
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
