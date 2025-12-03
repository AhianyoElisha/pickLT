"use client"

import React, { createContext, useContext, useState } from 'react'

export type MoveTypeKey = 'light' | 'regular' | 'premium'
export type HomeTypeKey = 'apartment' | 'house' | 'office' | 'storage'
export type FloorLevelKey = 'ground' | '1' | '2' | '3' | '4plus'
export type ParkingKey = 'at_building' | 'nearby' | 'no_parking'

type MoveSearchState = {
  pickupLocation: string
  moveDate: string | null // ISO date YYYY-MM-DD
  moveType: MoveTypeKey | null

  // Step 1 fields
  homeType: HomeTypeKey | null
  floorLevel: FloorLevelKey | null
  elevatorAvailable: boolean
  parkingSituation: ParkingKey | null
}

type MoveSearchActions = {
  setPickupLocation: (v: string) => void
  setMoveDate: (d: string | null) => void
  setMoveType: (t: MoveTypeKey | null) => void

  setHomeType: (h: HomeTypeKey | null) => void
  setFloorLevel: (f: FloorLevelKey | null) => void
  setElevatorAvailable: (b: boolean) => void
  setParkingSituation: (p: ParkingKey | null) => void

  reset: () => void
}

const defaultState: MoveSearchState = {
  pickupLocation: '',
  moveDate: null,
  moveType: null,
  homeType: null,
  floorLevel: null,
  elevatorAvailable: false,
  parkingSituation: null,
}

const MoveSearchContext = createContext<MoveSearchState & MoveSearchActions>({
  ...defaultState,
  setPickupLocation: () => {},
  setMoveDate: () => {},
  setMoveType: () => {},
  setHomeType: () => {},
  setFloorLevel: () => {},
  setElevatorAvailable: () => {},
  setParkingSituation: () => {},
  reset: () => {},
})

export const MoveSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [pickupLocation, setPickupLocation] = useState<string>(defaultState.pickupLocation)
  const [moveDate, setMoveDate] = useState<string | null>(defaultState.moveDate)
  const [moveType, setMoveType] = useState<MoveTypeKey | null>(defaultState.moveType)

  const [homeType, setHomeType] = useState<HomeTypeKey | null>(defaultState.homeType)
  const [floorLevel, setFloorLevel] = useState<FloorLevelKey | null>(defaultState.floorLevel)
  const [elevatorAvailable, setElevatorAvailable] = useState<boolean>(defaultState.elevatorAvailable)
  const [parkingSituation, setParkingSituation] = useState<ParkingKey | null>(defaultState.parkingSituation)

  const reset = () => {
    setPickupLocation(defaultState.pickupLocation)
    setMoveDate(defaultState.moveDate)
    setMoveType(defaultState.moveType)
    setHomeType(defaultState.homeType)
    setFloorLevel(defaultState.floorLevel)
    setElevatorAvailable(defaultState.elevatorAvailable)
    setParkingSituation(defaultState.parkingSituation)
  }

  return (
    <MoveSearchContext.Provider
      value={{
        pickupLocation,
        moveDate,
        moveType,
        homeType,
        floorLevel,
        elevatorAvailable,
        parkingSituation,
        setPickupLocation,
        setMoveDate,
        setMoveType,
        setHomeType,
        setFloorLevel,
        setElevatorAvailable,
        setParkingSituation,
        reset,
      }}
    >
      {children}
    </MoveSearchContext.Provider>
  )
}

export const useMoveSearch = () => useContext(MoveSearchContext)

export default MoveSearchProvider
