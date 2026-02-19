import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { APPWRITE } from '@/lib/constants'
import { auth } from '@clerk/nextjs/server'

// PATCH - update a crew member
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { databases } = createAdminClient()
    const { id } = await params
    const body = await req.json()
    const { name, phone, role, isActive } = body

    const updates: Record<string, unknown> = {}
    if (name !== undefined) updates.name = name
    if (phone !== undefined) updates.phone = phone
    if (role !== undefined) updates.role = role
    if (isActive !== undefined) updates.isActive = isActive

    const doc = await databases.updateDocument(
      APPWRITE.DATABASE_ID,
      APPWRITE.COLLECTIONS.CREW_MEMBERS,
      id,
      updates
    )

    return NextResponse.json({ crewMember: doc })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE - remove a crew member
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { databases } = createAdminClient()
    const { id } = await params

    await databases.deleteDocument(
      APPWRITE.DATABASE_ID,
      APPWRITE.COLLECTIONS.CREW_MEMBERS,
      id
    )

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
