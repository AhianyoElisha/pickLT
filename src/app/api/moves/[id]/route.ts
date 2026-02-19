import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { APPWRITE } from '@/lib/constants'
import { auth } from '@clerk/nextjs/server'

/**
 * GET /api/moves/[id]
 * Get a single move by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { databases } = createAdminClient()

    const move = await databases.getDocument(
      APPWRITE.DATABASE_ID,
      APPWRITE.COLLECTIONS.MOVES,
      id
    )

    // Verify the user owns this move or is the assigned mover
    const isOwner = move.clientId === userId || move.clientId?.$id === userId
    const isMover = move.moverProfileId?.userId === userId

    if (!isOwner && !isMover) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ move })
  } catch (err) {
    console.error('GET /api/moves/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
