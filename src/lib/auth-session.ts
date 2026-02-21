import { cookies } from 'next/headers'
import { verifySessionCookie, COOKIE_NAME } from '@/lib/session'

/**
 * Get the authenticated user's ID from the signed session cookie.
 * Returns the Appwrite Auth user ID if valid, null otherwise.
 *
 * The cookie is set by POST /api/auth/init-session after the client
 * authenticates via the Appwrite Web SDK.
 *
 * Usage in API routes:
 *   const userId = await getSessionUserId()
 *   if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value

  if (!sessionCookie) return null

  return verifySessionCookie(sessionCookie)
}
