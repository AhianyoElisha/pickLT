"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import type { UserDoc, MoverProfileDoc, CrewMemberDoc } from '@/lib/types'

export type UserType = 'client' | 'mover'

// The user shape consumed across the app — combines Clerk auth + Appwrite profile
export type User = {
  // Clerk ID
  clerkId: string
  // Appwrite doc ID (from users collection)
  appwriteId: string | null
  fullName: string
  email: string
  phone: string
  profilePhoto?: string
  userType: UserType
  emailVerified: boolean
  phoneVerified: boolean
  // Mover-specific fields (loaded from mover_profiles)
  moverDetails?: {
    profileId: string
    driversLicense?: string
    vehicleBrand?: string
    vehicleModel?: string
    vehicleYear?: string
    vehicleCapacity?: string
    vehicleRegistration?: string
    vehicleType?: string
    rating?: number
    totalMoves?: number
    yearsExperience?: number
    verificationStatus?: string
    isOnline?: boolean
    baseRate?: number
    languages?: string[]
  }
}

export type CrewMember = {
  id: string
  name: string
  phone: string
  photo?: string
  role: 'driver' | 'helper'
  isActive: boolean
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  userType: UserType
  crewMembers: CrewMember[]
}

type AuthActions = {
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  setUserType: (type: UserType) => void
  refreshProfile: () => Promise<void>
  addCrewMember: (member: CrewMember) => void
  updateCrewMember: (id: string, updates: Partial<CrewMember>) => void
  removeCrewMember: (id: string) => void
}

const defaultState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userType: 'client',
  crewMembers: [],
}

const AuthContext = createContext<AuthState & AuthActions>({
  ...defaultState,
  logout: () => {},
  updateUser: () => {},
  setUserType: () => {},
  refreshProfile: async () => {},
  addCrewMember: () => {},
  updateCrewMember: () => {},
  removeCrewMember: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { signOut } = useClerkAuth()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<UserType>('client')
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([])

  // Sync Clerk user → Appwrite users collection on login
  const syncUser = useCallback(async () => {
    if (!isSignedIn || !clerkUser) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
          fullName: clerkUser.fullName ?? `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
          phone: clerkUser.primaryPhoneNumber?.phoneNumber ?? '',
          profilePhoto: clerkUser.imageUrl ?? '',
          emailVerified: clerkUser.primaryEmailAddress?.verification?.status === 'verified',
          phoneVerified: clerkUser.primaryPhoneNumber?.verification?.status === 'verified',
        }),
      })

      if (!res.ok) throw new Error('Failed to sync user')

      const data = await res.json()
      const appwriteUser: UserDoc = data.user
      const moverProfile: MoverProfileDoc | null = data.moverProfile ?? null
      const crewData: CrewMemberDoc[] = data.crewMembers ?? []

      const mappedUser: User = {
        clerkId: clerkUser.id,
        appwriteId: appwriteUser.$id,
        fullName: appwriteUser.fullName,
        email: appwriteUser.email,
        phone: appwriteUser.phone ?? '',
        profilePhoto: appwriteUser.profilePhoto ?? clerkUser.imageUrl,
        userType: (appwriteUser.userType as UserType) ?? 'client',
        emailVerified: appwriteUser.emailVerified ?? false,
        phoneVerified: appwriteUser.phoneVerified ?? false,
        ...(moverProfile && {
          moverDetails: {
            profileId: moverProfile.$id,
            driversLicense: moverProfile.driversLicense ?? undefined,
            vehicleBrand: moverProfile.vehicleBrand ?? undefined,
            vehicleModel: moverProfile.vehicleModel ?? undefined,
            vehicleYear: moverProfile.vehicleYear ?? undefined,
            vehicleCapacity: moverProfile.vehicleCapacity ?? undefined,
            vehicleRegistration: moverProfile.vehicleRegistration ?? undefined,
            vehicleType: moverProfile.vehicleType ?? undefined,
            rating: moverProfile.rating ?? undefined,
            totalMoves: moverProfile.totalMoves ?? undefined,
            yearsExperience: moverProfile.yearsExperience ?? undefined,
            verificationStatus: moverProfile.verificationStatus ?? undefined,
            isOnline: moverProfile.isOnline ?? undefined,
            baseRate: moverProfile.baseRate ?? undefined,
            languages: moverProfile.languages ?? undefined,
          },
        }),
      }

      setUser(mappedUser)
      setUserType(mappedUser.userType)

      // Map crew members
      if (crewData.length > 0) {
        setCrewMembers(
          crewData.map((c) => ({
            id: c.$id,
            name: c.name ?? '',
            phone: c.phone ?? '',
            photo: c.photo ?? undefined,
            role: (c.role as 'driver' | 'helper') ?? 'helper',
            isActive: c.isActive ?? true,
          }))
        )
      }
    } catch (err) {
      console.error('Failed to sync user with Appwrite:', err)
      // Still set a basic user from Clerk data so the app doesn't break
      setUser({
        clerkId: clerkUser.id,
        appwriteId: null,
        fullName: clerkUser.fullName ?? '',
        email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
        phone: clerkUser.primaryPhoneNumber?.phoneNumber ?? '',
        profilePhoto: clerkUser.imageUrl,
        userType: 'client',
        emailVerified: clerkUser.primaryEmailAddress?.verification?.status === 'verified',
        phoneVerified: clerkUser.primaryPhoneNumber?.verification?.status === 'verified',
      })
    } finally {
      setIsLoading(false)
    }
  }, [isSignedIn, clerkUser])

  // Run sync when Clerk auth state changes
  useEffect(() => {
    if (clerkLoaded) {
      syncUser()
    }
  }, [clerkLoaded, isSignedIn, syncUser])

  const logout = async () => {
    await signOut()
    setUser(null)
    setUserType('client')
    setCrewMembers([])
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null))
  }

  const refreshProfile = async () => {
    await syncUser()
  }

  const addCrewMember = (member: CrewMember) => {
    setCrewMembers((prev) => [...prev, member])
  }

  const updateCrewMember = (id: string, updates: Partial<CrewMember>) => {
    setCrewMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const removeCrewMember = (id: string) => {
    setCrewMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        userType,
        crewMembers,
        logout,
        updateUser,
        setUserType,
        refreshProfile,
        addCrewMember,
        updateCrewMember,
        removeCrewMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
