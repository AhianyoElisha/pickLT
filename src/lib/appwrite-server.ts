import { Client, Databases, Storage, Users } from 'node-appwrite'

// ─── Appwrite Server SDK (for API routes / server components) ───
function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

  return {
    client,
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  }
}

export { createAdminClient }
