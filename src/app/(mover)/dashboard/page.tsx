'use client'

import { useAuth } from '@/context/auth'
import { CalendarDaysIcon, CurrencyEuroIcon, TruckIcon, UsersIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Badge } from '@/shared/Badge'
import Image from 'next/image'
import Link from 'next/link'

interface RecentMove {
  id: number
  pickup: string
  pickupAddress: string
  dropoff: string
  dropoffAddress: string
  date: string
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled'
  amount: number
  moveType: string
  itemCount: number
  distance: string
}

const DashboardPage = () => {
  const { user, crewMembers } = useAuth()

  const stats = [
    {
      name: 'Available Moves',
      value: 12,
      icon: TruckIcon,
      href: '/available-moves',
      color: 'bg-blue-500',
    },
    {
      name: 'Completed This Month',
      value: 28,
      icon: CalendarDaysIcon,
      href: '#',
      color: 'bg-green-500',
    },
    {
      name: 'Crew Members',
      value: crewMembers?.length || 0,
      icon: UsersIcon,
      href: '/my-crew',
      color: 'bg-purple-500',
    },
    {
      name: 'Earnings This Month',
      value: '€2,450',
      icon: CurrencyEuroIcon,
      href: '/earnings',
      color: 'bg-yellow-500',
    },
  ]

  const recentMoves: RecentMove[] = [
    {
      id: 1,
      pickup: 'Berlin Mitte',
      pickupAddress: 'Alexanderplatz 1, 10178 Berlin',
      dropoff: 'Berlin Kreuzberg',
      dropoffAddress: 'Oranienstraße 25, 10999 Berlin',
      date: 'Today, 14:30',
      status: 'completed',
      amount: 85,
      moveType: 'Light',
      itemCount: 15,
      distance: '4.2 km',
    },
    {
      id: 2,
      pickup: 'Berlin Prenzlauer Berg',
      pickupAddress: 'Schönhauser Allee 80, 10439 Berlin',
      dropoff: 'Berlin Charlottenburg',
      dropoffAddress: 'Kantstraße 45, 10627 Berlin',
      date: 'Today, 10:00',
      status: 'completed',
      amount: 120,
      moveType: 'Regular',
      itemCount: 32,
      distance: '8.5 km',
    },
    {
      id: 3,
      pickup: 'Berlin Wedding',
      pickupAddress: 'Müllerstraße 120, 13353 Berlin',
      dropoff: 'Berlin Tempelhof',
      dropoffAddress: 'Tempelhofer Damm 70, 12101 Berlin',
      date: 'Yesterday, 16:00',
      status: 'completed',
      amount: 95,
      moveType: 'Light',
      itemCount: 18,
      distance: '10.2 km',
    },
  ]

  const getStatusBadgeColor = (status: RecentMove['status']): 'green' | 'yellow' | 'red' | 'blue' => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'in_progress':
        return 'blue'
      case 'pending':
        return 'yellow'
      case 'cancelled':
        return 'red'
      default:
        return 'yellow'
    }
  }

  const getStatusLabel = (status: RecentMove['status']): string => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in_progress':
        return 'In Progress'
      case 'pending':
        return 'Pending'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
            {user?.profilePhoto ? (
              <Image
                src={user.profilePhoto}
                alt={user.fullName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-neutral-500">
                {user?.fullName?.charAt(0) || 'M'}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Mover'}!
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Here&apos;s what&apos;s happening today
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {stat.value}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {stat.name}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/available-moves"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <TruckIcon className="w-4 h-4" />
            Find Moves
          </Link>
          <Link
            href="/my-crew"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-full text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            <UsersIcon className="w-4 h-4" />
            Manage Crew
          </Link>
        </div>
      </div>

      {/* Recent Moves */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Recent Moves
          </h2>
          <Link 
            href="/earnings" 
            className="text-sm text-primary-600 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {recentMoves.map((move) => (
            <div
              key={move.id}
              className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card Header with gradient */}
              <div className="relative h-20 bg-gradient-to-br from-green-50 to-green-100 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                <TruckIcon className="h-10 w-10 text-green-200 dark:text-neutral-600" />
                <Badge color={getStatusBadgeColor(move.status)} className="absolute top-2 left-2">
                  {getStatusLabel(move.status)}
                </Badge>
                <span className="absolute top-2 right-2 text-xs px-2 py-0.5 bg-white/80 dark:bg-neutral-800/80 rounded-full text-neutral-600 dark:text-neutral-400">
                  {move.moveType} Move
                </span>
              </div>

              <div className="p-4">
                {/* Title row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>{move.date}</span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {move.pickup} → {move.dropoff}
                    </h3>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400 ml-2">
                    €{move.amount}
                  </p>
                </div>

                {/* Route visualization */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                      {move.pickupAddress}
                    </span>
                  </div>
                  <div className="w-px h-2 bg-neutral-300 dark:bg-neutral-600 ml-1" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                      {move.dropoffAddress}
                    </span>
                  </div>
                </div>

                {/* Stats footer */}
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-700">
                  <span>{move.itemCount} items</span>
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    {move.distance}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
