import { getCollection } from '../config/database.js';
import { ObjectId } from 'mongodb';
import { User } from '../models/User.js';
import crypto from 'crypto';

const collectionName = 'users';

// Simple password hashing (for demo - use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * CREATE OPERATIONS
 */

/**
 * Create a new user account
 */
export async function createUser(userData) {
  try {
    const collection = getCollection(collectionName);
    
    // Check if username or email already exists
    const existingUser = await collection.findOne({
      $or: [
        { username: userData.username },
        { email: userData.email }
      ]
    });
    
    if (existingUser) {
      throw new Error('Username or email already exists');
    }
    
    const user = new User({
      ...userData,
      password: hashPassword(userData.password)
    });
    
    const result = await collection.insertOne(user);
    console.log(`✅ User created: ${user.username}`);
    
    // Return user without password
    const createdUser = await collection.findOne({ _id: result.insertedId });
    delete createdUser.password;
    return createdUser;
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    throw error;
  }
}

/**
 * READ OPERATIONS
 */

/**
 * Find user by username
 */
export async function findUserByUsername(username) {
  try {
    const collection = getCollection(collectionName);
    const user = await collection.findOne({ username });
    if (user) {
      delete user.password;
    }
    return user;
  } catch (error) {
    console.error('❌ Error finding user by username:', error.message);
    throw error;
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
  try {
    const collection = getCollection(collectionName);
    const user = await collection.findOne({ email });
    if (user) {
      delete user.password;
    }
    return user;
  } catch (error) {
    console.error('❌ Error finding user by email:', error.message);
    throw error;
  }
}

/**
 * Find user by ID
 */
export async function findUserById(userId) {
  try {
    const collection = getCollection(collectionName);
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (user) {
      delete user.password;
    }
    return user;
  } catch (error) {
    console.error('❌ Error finding user by ID:', error.message);
    throw error;
  }
}

/**
 * Authenticate user (login)
 */
export async function authenticateUser(username, password) {
  try {
    const collection = getCollection(collectionName);
    const hashedPassword = hashPassword(password);
    
    const user = await collection.findOne({
      $or: [
        { username },
        { email: username }
      ],
      password: hashedPassword
    });
    
    if (!user) {
      return null;
    }
    
    // Update last login
    await collection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );
    
    // Return user without password
    delete user.password;
    return user;
  } catch (error) {
    console.error('❌ Error authenticating user:', error.message);
    throw error;
  }
}

/**
 * UPDATE OPERATIONS
 */

/**
 * Update user profile
 */
export async function updateUser(userId, updateData) {
  try {
    const collection = getCollection(collectionName);
    
    // Don't allow password update through this function
    delete updateData.password;
    
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }
    
    return await findUserById(userId);
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
    throw error;
  }
}

