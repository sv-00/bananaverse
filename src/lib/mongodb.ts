// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.DATABASE_URL!;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
    if (cachedClient) {
        return { client: cachedClient, db: cachedClient.db() };
    }

    const client = await MongoClient.connect(MONGODB_URI);
    cachedClient = client;

    return { client, db: client.db() };
}