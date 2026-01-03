import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'lost_found_db';

let client = null;
let db = null;

/**
 * Connect to MongoDB database
 */
export async function connectDB() {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('✅ Connected to MongoDB Atlas');
    }
    
    if (!db) {
      db = client.db(DATABASE_NAME);
    }
    
    // Test the connection
    await db.admin().ping();
    console.log('✅ Database connection verified');
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Check your .env file and MongoDB Atlas connection');
    throw error; // Throw to prevent server from starting without DB
  }
}

/**
 * Get database instance
 */
export function getDB() {
  if (!db) {
    throw new Error('Database not connected. Please make sure MongoDB is running and restart the server.');
  }
  return db;
}

/**
 * Get collection by name
 */
export function getCollection(collectionName) {
  const database = getDB();
  return database.collection(collectionName);
}

/**
 * Close database connection
 */
export async function closeDB() {
  try {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
      client = null;
      db = null;
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
}

