import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/session'

/**
 * POST /api/auth/clear-session
 *
 * Clears the server-side session cookie on logout.
 */
export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, '', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
  })
  return response
}
