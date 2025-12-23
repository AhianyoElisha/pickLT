'use client'

import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import clsx from 'clsx'
import { FC, useState } from 'react'
import DatePicker from 'react-datepicker'

interface Props {
  className?: string
  onChange?: (date: Date | null) => void
  defaultDate?: Date | null
  headingText?: string
  inputName?: string
}

const SingleDateInput: FC<Props> = ({
  className,
  defaultDate,
  onChange,
  headingText = 'When is your move?',
  inputName = 'moveDate',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate || null)

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    if (onChange) {
      onChange(date)
    }
  }

  return (
    <>
      <div className={clsx(className)}>
        <h3 className="block text-center text-xl font-semibold sm:text-2xl">{headingText}</h3>
        <div className="relative z-10 flex shrink-0 justify-center py-5">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            monthsShown={2}
            showPopperArrow={false}
            inline
            minDate={new Date()}
            renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
            renderDayContents={(day, date) => <DatePickerCustomDay dayOfMonth={day} date={date} />}
          />
        </div>
      </div>

      {/* Hidden input for form submission */}
      <input type="hidden" name={inputName} value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''} />
    </>
  )
}

export default SingleDateInput
