import { NextRequest } from 'next/server'
import { Client, Account, Databases, Storage, Users } from 'node-appwrite'

/**
 * Verify an Appwrite session from a request cookie.
 * Returns the Appwrite user ID if valid, null otherwise.
 *
 * Client-side Appwrite SDK stores the session as a cookie named
 * `a_session_{projectId}` (with dots replaced by underscores).
 */
export async function getAuthUser(req: NextRequest) {
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
  const cookieName = `a_session_${projectId.replace(/\./g, '_')}`

  // Appwrite session can also be sent via fallback cookie name
  const sessionCookie =
    req.cookies.get(cookieName)?.value ||
    req.cookies.get(`a_session_${projectId}`)?.value

  if (!sessionCookie) return null

  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(projectId)
      .setSession(sessionCookie)

    const account = new Account(client)
    const user = await account.get()

    return {
      userId: user.$id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      emailVerification: user.emailVerification,
      phoneVerification: user.phoneVerification,
    }
  } catch {
    return null
  }
}

/**
 * Create a server-side Appwrite client using the session cookie
 * — gives the request the permissions of the logged-in user.
 */
export function createSessionClient(req: NextRequest) {
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
  const cookieName = `a_session_${projectId.replace(/\./g, '_')}`

  const sessionCookie =
    req.cookies.get(cookieName)?.value ||
    req.cookies.get(`a_session_${projectId}`)?.value

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(projectId)

  if (sessionCookie) {
    client.setSession(sessionCookie)
  }

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  }
}
