import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "photoportfolio"

let client
let clientPromise

if (!globalThis._mongoClientPromise) {
  if (uri) {
    client = new MongoClient(uri)
    globalThis._mongoClientPromise = client.connect()
  } else {
    globalThis._mongoClientPromise = null
  }
}

clientPromise = globalThis._mongoClientPromise

export function isMongoConfigured() {
  return Boolean(uri)
}

export async function getDb() {
  if (!clientPromise) {
    throw new Error("MongoDB is not configured")
  }

  const resolvedClient = await clientPromise
  return resolvedClient.db(dbName)
}
