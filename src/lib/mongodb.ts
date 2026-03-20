// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
    if (cachedClient) {
        return { client: cachedClient, db: cachedClient.db() };
    }

    const uri = process.env.DATABASE_URL;
    if (!uri) {
        throw new Error('Please define DATABASE_URL environment variable');
    }

    const client = await MongoClient.connect(uri);
    cachedClient = client;

    return { client, db: client.db() };
}