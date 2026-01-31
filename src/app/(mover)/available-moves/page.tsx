'use client'

import { useState } from 'react'
import {
  MapIcon,
  ListBulletIcon,
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import MoverMapboxMap from '@/components/MoverMapboxMap'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Badge } from '@/shared/Badge'

interface AvailableMove {
  id: string
  pickup: string
  pickupAddress: string
  dropoff: string
  dropoffAddress: string
  distance: string
  estimatedTime: string
  price: number
  moveType: string
  homeType: string
  items: string[]
  itemCount: number
  crewSize: string
  requestedTime: string
  clientName: string
  lat: number
  lng: number
  hasElevator: boolean
  dropoffHasElevator: boolean
  floor: string
  dropoffFloor: string
  additionalServices: string[]
  notes: string
}

const AVAILABLE_MOVES: AvailableMove[] = [
  {
    id: '1',
    pickup: 'Berlin Mitte',
    pickupAddress: 'Alexanderplatz 1, 10178 Berlin',
    dropoff: 'Berlin Kreuzberg',
    dropoffAddress: 'Oranienstraße 25, 10999 Berlin',
    distance: '4.2 km',
    estimatedTime: '45 min',
    price: 85,
    moveType: 'Light',
    homeType: 'Apartment',
    items: ['Sofa', 'Bed', 'Boxes (10)'],
    itemCount: 15,
    crewSize: '2',
    requestedTime: 'Today, 14:30',
    clientName: 'Max M.',
    lat: 52.5219,
    lng: 13.4132,
    hasElevator: true,
    dropoffHasElevator: true,
    floor: '3',
    dropoffFloor: '2',
    additionalServices: [],
    notes: '',
  },
  {
    id: '2',
    pickup: 'Berlin Prenzlauer Berg',
    pickupAddress: 'Schönhauser Allee 80, 10439 Berlin',
    dropoff: 'Berlin Charlottenburg',
    dropoffAddress: 'Kantstraße 45, 10627 Berlin',
    distance: '8.5 km',
    estimatedTime: '1h 15min',
    price: 150,
    moveType: 'Regular',
    homeType: 'House',
    items: ['Full household', 'Piano'],
    itemCount: 45,
    crewSize: '3',
    requestedTime: 'Today, 16:00',
    clientName: 'Anna S.',
    lat: 52.5389,
    lng: 13.4113,
    hasElevator: false,
    dropoffHasElevator: true,
    floor: '5',
    dropoffFloor: '1',
    additionalServices: ['Furniture disassembly'],
    notes: 'Piano needs special care',
  },
  {
    id: '3',
    pickup: 'Berlin Wedding',
    pickupAddress: 'Müllerstraße 120, 13353 Berlin',
    dropoff: 'Berlin Tempelhof',
    dropoffAddress: 'Tempelhofer Damm 70, 12101 Berlin',
    distance: '10.2 km',
    estimatedTime: '1h 30min',
    price: 180,
    moveType: 'Premium',
    homeType: 'Office',
    items: ['Desks (5)', 'Chairs (10)', 'Filing cabinets'],
    itemCount: 80,
    crewSize: '4+',
    requestedTime: 'Tomorrow, 09:00',
    clientName: 'Tech GmbH',
    lat: 52.5503,
    lng: 13.3591,
    hasElevator: true,
    dropoffHasElevator: true,
    floor: '1',
    dropoffFloor: 'Ground',
    additionalServices: ['Furniture disassembly', 'Furniture assembly'],
    notes: 'Reception will guide you',
  },
  {
    id: '4',
    pickup: 'Berlin Neukölln',
    pickupAddress: 'Karl-Marx-Straße 100, 12043 Berlin',
    dropoff: 'Berlin Friedrichshain',
    dropoffAddress: 'Warschauer Straße 30, 10243 Berlin',
    distance: '5.8 km',
    estimatedTime: '50 min',
    price: 95,
    moveType: 'Light',
    homeType: 'Apartment',
    items: ['Large wardrobe'],
    itemCount: 5,
    crewSize: '1',
    requestedTime: 'Today, 18:00',
    clientName: 'Lisa K.',
    lat: 52.4816,
    lng: 13.4334,
    hasElevator: false,
    dropoffHasElevator: true,
    floor: '4',
    dropoffFloor: '2',
    additionalServices: [],
    notes: 'Large wardrobe, handle with care',
  },
  {
    id: '5',
    pickup: 'Berlin Schöneberg',
    pickupAddress: 'Hauptstraße 50, 10827 Berlin',
    dropoff: 'Berlin Spandau',
    dropoffAddress: 'Falkenseer Damm 10, 13585 Berlin',
    distance: '15.3 km',
    estimatedTime: '2h',
    price: 220,
    moveType: 'Regular',
    homeType: 'Apartment',
    items: ['2-bedroom apartment contents'],
    itemCount: 35,
    crewSize: '2',
    requestedTime: 'Tomorrow, 11:00',
    clientName: 'Thomas W.',
    lat: 52.4839,
    lng: 13.3536,
    hasElevator: true,
    dropoffHasElevator: false,
    floor: '2',
    dropoffFloor: '3',
    additionalServices: ['Furniture disassembly', 'Furniture assembly'],
    notes: '',
  },
]

const AvailableMovesPage = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [selectedMove, setSelectedMove] = useState<AvailableMove | null>(null)
  const [hoveredMoveId, setHoveredMoveId] = useState<string | null>(null)

  const handleAcceptMove = (move: AvailableMove) => {
    console.log('Accepting move:', move)
    alert(`Move accepted! You will pick up from ${move.pickup}`)
  }

  const mapMarkers = AVAILABLE_MOVES.map((move) => ({
    id: move.id,
    lat: move.lat,
    lng: move.lng,
    price: move.price,
    isSelected: selectedMove?.id === move.id,
  }))

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Available Moves
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {AVAILABLE_MOVES.length} moves near you
            </p>
          </div>
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <ListBulletIcon className="w-4 h-4" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'map' ? (
          <div className="h-full relative">
            {/* Mapbox Map */}
            <MoverMapboxMap
              markers={mapMarkers}
              selectedMarkerId={selectedMove?.id}
              onMarkerClick={(id) => {
                const move = AVAILABLE_MOVES.find((m) => m.id === id)
                setSelectedMove(move || null)
              }}
              onMarkerHover={setHoveredMoveId}
              defaultCenter={{ lat: 52.52, lng: 13.405 }}
              defaultZoom={12}
            />

            {/* Move Cards Carousel at bottom */}
            <div className="absolute bottom-20 lg:bottom-4 left-0 right-0 px-4">
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                {AVAILABLE_MOVES.map((move) => (
                  <div
                    key={move.id}
                    onClick={() => setSelectedMove(move)}
                    onMouseEnter={() => setHoveredMoveId(move.id)}
                    onMouseLeave={() => setHoveredMoveId(null)}
                    className={`flex-shrink-0 w-80 bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg snap-start cursor-pointer transition-all ${
                      selectedMove?.id === move.id
                        ? 'ring-2 ring-primary-500'
                        : hoveredMoveId === move.id
                        ? 'ring-2 ring-neutral-300 dark:ring-neutral-600'
                        : ''
                    }`}
                  >
                    {/* Card Header */}
                    <div className="relative h-24 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                      <TruckIcon className="h-12 w-12 text-primary-300 dark:text-neutral-600" />
                      <Badge color="yellow" className="absolute top-2 left-2">
                        {move.moveType} Move
                      </Badge>
                    </div>
                    
                    <div className="p-4">
                      {/* Title and price */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {move.requestedTime}
                          </p>
                          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {move.pickup} → {move.dropoff}
                          </h3>
                        </div>
                        <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100 ml-2">
                          €{move.price}
                        </p>
                      </div>
                      
                      {/* Route visualization */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                            {move.pickupAddress}
                          </span>
                        </div>
                        <div className="w-px h-2 bg-neutral-300 dark:bg-neutral-600 ml-1" />
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                            {move.dropoffAddress}
                          </span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-700">
                        <span>{move.itemCount} items</span>
                        <span>{move.distance}</span>
                        <span>{move.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="h-full overflow-y-auto p-4 pb-24 lg:pb-4 space-y-4">
            {AVAILABLE_MOVES.map((move) => (
              <div
                key={move.id}
                className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="relative h-32 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                  <TruckIcon className="h-16 w-16 text-primary-200 dark:text-neutral-600" />
                  <Badge color="yellow" className="absolute top-3 left-3">
                    {move.homeType} · {move.moveType}
                  </Badge>
                </div>

                <div className="p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{move.requestedTime}</span>
                        <span>·</span>
                        <span>{move.clientName}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {move.pickup} → {move.dropoff}
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      €{move.price}
                    </p>
                  </div>

                  {/* Route details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {move.pickup}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {move.pickupAddress}
                        </p>
                      </div>
                    </div>
                    <div className="w-px h-3 bg-neutral-300 dark:bg-neutral-600 ml-1" />
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {move.dropoff}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {move.dropoffAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Move info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full">
                      {move.itemCount} items
                    </span>
                    <span className="text-xs px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full">
                      {move.crewSize} movers
                    </span>
                    {move.hasElevator && (
                      <span className="text-xs px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        Elevator
                      </span>
                    )}
                    {move.additionalServices.length > 0 && (
                      <span className="text-xs px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                        +{move.additionalServices.length} services
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {move.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {move.estimatedTime}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAcceptMove(move)}
                      className="px-5 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Accept Move
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Move Detail Modal */}
      {selectedMove && viewMode === 'map' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="relative h-32 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
              <TruckIcon className="h-16 w-16 text-primary-200 dark:text-neutral-600" />
              <Badge color="yellow" className="absolute top-3 left-3">
                {selectedMove.homeType} · {selectedMove.moveType}
              </Badge>
              <button
                onClick={() => setSelectedMove(null)}
                className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-700 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              {/* Price and time */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <ClockIcon className="w-5 h-5" />
                  <span>{selectedMove.requestedTime}</span>
                </div>
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  €{selectedMove.price}
                </p>
              </div>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Requested by {selectedMove.clientName}
              </p>

              {/* Route */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {selectedMove.pickup}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {selectedMove.pickupAddress}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      Floor {selectedMove.floor} · {selectedMove.hasElevator ? 'Elevator available' : 'No elevator'}
                    </p>
                  </div>
                </div>
                <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 ml-1.5" />
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {selectedMove.dropoff}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {selectedMove.dropoffAddress}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      Floor {selectedMove.dropoffFloor} · {selectedMove.dropoffHasElevator ? 'Elevator available' : 'No elevator'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Move details */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Move Details
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full">
                    {selectedMove.itemCount} items
                  </span>
                  <span className="text-sm px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full">
                    {selectedMove.crewSize} movers needed
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Items to Move
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMove.items.map((item, index) => (
                    <span
                      key={index}
                      className="text-sm px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional services */}
              {selectedMove.additionalServices.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Additional Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMove.additionalServices.map((service, index) => (
                      <span
                        key={index}
                        className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedMove.notes && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Notes from Client
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-3">
                    {selectedMove.notes}
                  </p>
                </div>
              )}

              {/* Distance and time */}
              <div className="flex items-center gap-4 mb-6 text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-5 h-5" />
                  <span>{selectedMove.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>{selectedMove.estimatedTime}</span>
                </div>
              </div>

              <ButtonPrimary
                onClick={() => handleAcceptMove(selectedMove)}
                className="w-full"
              >
                Accept This Move
              </ButtonPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AvailableMovesPage
