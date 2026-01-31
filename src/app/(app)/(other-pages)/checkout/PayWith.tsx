'use client'

import { Description, Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import {
  Coins01Icon,
  CreditCardIcon,
  InformationCircleIcon,
  MasterCardIcon,
  PaypalIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

export type PaymentMethod = 'cash' | 'card' | 'paypal'

interface PayWithProps {
  onPaymentMethodChange?: (method: PaymentMethod) => void
  selectedMethod?: PaymentMethod
}

const PayWith = ({ onPaymentMethodChange, selectedMethod = 'cash' }: PayWithProps) => {
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(selectedMethod)

  const handleMethodChange = (index: number) => {
    const methods: PaymentMethod[] = ['cash', 'card', 'paypal']
    const method = methods[index]
    setPaymentMethod(method)
    onPaymentMethodChange?.(method)
  }

  const getDefaultIndex = () => {
    const methods: PaymentMethod[] = ['cash', 'card', 'paypal']
    return methods.indexOf(paymentMethod)
  }

  return (
    <div className="pt-5">
      <h3 className="text-2xl font-semibold">Pay with</h3>
      <div className="my-5 w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      <TabGroup
        className="mt-6"
        defaultIndex={getDefaultIndex()}
        onChange={handleMethodChange}
      >
        <TabList className="my-5 flex flex-wrap gap-2 text-sm">
          <Tab className="flex items-center gap-x-2 rounded-full px-4 py-2.5 leading-none font-medium data-hover:bg-black/5 data-selected:bg-neutral-900 data-selected:text-white sm:px-6 dark:data-selected:bg-neutral-100 dark:data-selected:text-neutral-900">
            <HugeiconsIcon icon={Coins01Icon} size={20} strokeWidth={1.5} />
            Cash
          </Tab>
          <Tab className="flex items-center gap-x-2 rounded-full px-4 py-2.5 leading-none font-medium data-hover:bg-black/5 data-selected:bg-neutral-900 data-selected:text-white sm:px-6 dark:data-selected:bg-neutral-100 dark:data-selected:text-neutral-900">
            <HugeiconsIcon icon={CreditCardIcon} size={20} strokeWidth={1.5} />
            Card
          </Tab>
          <Tab className="flex items-center gap-x-2 rounded-full px-4 py-2.5 leading-none font-medium data-hover:bg-black/5 data-selected:bg-neutral-900 data-selected:text-white sm:px-6 dark:data-selected:bg-neutral-100 dark:data-selected:text-neutral-900">
            <HugeiconsIcon icon={PaypalIcon} size={20} strokeWidth={1.5} />
            PayPal
          </Tab>
        </TabList>

        <TabPanels>
          {/* Cash Payment Panel */}
          <TabPanel className="flex flex-col gap-y-5">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-800/50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={20}
                    strokeWidth={1.5}
                    className="text-neutral-500"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">
                    Pay your mover directly
                  </h4>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    When you choose cash payment, you&apos;ll pay the mover directly after your move is completed. 
                    Please have the exact amount ready.
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      No upfront payment required
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      Pay after move is complete
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      Receipt provided by mover
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <Field>
              <Label>Notes for mover (optional)</Label>
              <Textarea 
                name="cashPaymentNotes" 
                className="mt-1.5" 
                placeholder="Any special requests or notes..."
                rows={3}
              />
              <Description>
                Let your mover know if you have any specific requests.
              </Description>
            </Field>
          </TabPanel>

          {/* Credit Card Panel */}
          <TabPanel className="flex flex-col gap-y-5">
            <Field>
              <Label>Card number</Label>
              <Input name="card-number" className="mt-1.5" placeholder="1234 5678 9012 3456" />
            </Field>
            <Field>
              <Label>Card holder</Label>
              <Input name="card-holder" placeholder="JOHN DOE" />
            </Field>
            <div className="flex gap-x-5">
              <Field className="flex-1">
                <Label>Expiration date</Label>
                <Input name="expiration-date" className="mt-1.5" placeholder="MM/YY" />
              </Field>
              <Field className="flex-1">
                <Label>CVC</Label>
                <Input name="CVC" className="mt-1.5" placeholder="123" />
              </Field>
            </div>
            <Field>
              <Label>Notes (optional)</Label>
              <Textarea name="cardNotes" className="mt-1.5" placeholder="Any additional notes..." rows={2} />
            </Field>
          </TabPanel>

          {/* PayPal Panel */}
          <TabPanel className="flex flex-col gap-y-5">
            <Field>
              <Label>PayPal email</Label>
              <Input name="paypal-email" className="mt-1.5" type="email" placeholder="your@email.com" />
            </Field>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                You&apos;ll be redirected to PayPal to complete your payment securely.
              </p>
            </div>
            <Field>
              <Label>Notes (optional)</Label>
              <Textarea name="paypalNotes" className="mt-1.5" placeholder="Any additional notes..." rows={2} />
            </Field>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <input type="hidden" name="paymentMethod" value={paymentMethod} />
    </div>
  )
}

export default PayWith
