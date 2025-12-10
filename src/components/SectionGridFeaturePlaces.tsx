'use client'

import { MoveStatus, StoredMove, useMoveSearch } from '@/context/moveSearch'
import ButtonPrimary from '@/shared/ButtonPrimary'
import T from '@/utils/getT'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { FC, ReactNode, useState } from 'react'
import MoveCard from './MoveCard'
import SectionTabHeader from './SectionTabHeader'

//
interface SectionGridFeaturePlacesProps {
  gridClass?: string
  heading?: ReactNode
  subHeading?: string
  headingIsCenter?: boolean
}

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  gridClass = '',
  heading = 'Your Moves',
  subHeading = 'Track all your moves',
}) => {
  const tabs = ['All Moves', 'Pending', 'In Progress', 'Completed', 'Cancelled']
  const [activeTab, setActiveTab] = useState('All Moves')

  const { storedMoves, getFilteredMoves } = useMoveSearch()

  // Map tab to status filter
  const getStatusFromTab = (tab: string): MoveStatus | undefined => {
    switch (tab) {
      case 'Pending':
        return 'pending'
      case 'In Progress':
        return 'in_progress'
      case 'Completed':
        return 'completed'
      case 'Cancelled':
        return 'cancelled'
      default:
        return undefined
    }
  }

  const filteredMoves = getStatusFromTab(activeTab) 
    ? getFilteredMoves(getStatusFromTab(activeTab)) 
    : storedMoves

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className="relative">
      <SectionTabHeader 
        tabActive={activeTab} 
        subHeading={subHeading} 
        tabs={tabs} 
        heading={heading}
        onChangeTab={handleTabChange}
      />
      {filteredMoves.length > 0 ? (
        <div
          className={`mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
        >
          {filteredMoves.map((move) => (
            <MoveCard key={move.id} data={move} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-6">
            {activeTab === 'All Moves' 
              ? 'No moves yet. Start by booking your first move!'
              : `No ${activeTab.toLowerCase()} moves found.`}
          </p>
        </div>
      )}
      <div className="mt-16 flex items-center justify-center">
        <ButtonPrimary href={'/add-listing/1'}>
          {T['common']['Show me more']}
          <ArrowRightIcon className="h-5 w-5 rtl:rotate-180" />
        </ButtonPrimary>
      </div>
    </div>
  )
}

export default SectionGridFeaturePlaces
