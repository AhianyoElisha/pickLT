'use client'

import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Cog8ToothIcon as CogIcon, ShoppingBagIcon as ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import { ThemeContext } from './theme-provider'



const CustomizeControl = () => {
  const theme = useContext(ThemeContext)
  //
  const pathname = usePathname()

  const renderSwitchDarkMode = () => {
    return (
      <div className="mt-4">
        <span className="text-sm font-medium">Dark mode</span>
        <div className="mt-1.5">
          <SwitchDarkMode2 />
        </div>
      </div>
    )
  }

  return (
    <div className="relative hidden lg:block">
      <div className="fixed top-1/4 right-5 z-40 flex items-center">
        <Popover className="relative">
          {({ open }) => (
            <>
              <PopoverButton
                className={`rounded-xl border border-neutral-200 bg-white p-2.5 shadow-xl hover:bg-neutral-100 focus:outline-hidden dark:border-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 ${
                  open ? 'ring-primary-500 focus:ring-2' : ''
                }`}
              >
                <CogIcon className="h-8 w-8" />
              </PopoverButton>

              <PopoverPanel
                transition
                className="absolute right-0 z-10 mt-3 w-50 rounded-2xl bg-white custom-shadow-1 transition data-closed:translate-y-1 data-closed:opacity-0 dark:bg-neutral-800"
              >
                <div className="relative p-6">
                  <span className="text-xl font-semibold">Customize</span>
                  <div className="mt-4 w-10 border-b border-neutral-200 dark:border-neutral-700"></div>
                  {renderSwitchDarkMode()}
                </div>
              </PopoverPanel>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default CustomizeControl
