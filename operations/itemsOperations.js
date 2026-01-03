import { getCollection } from '../config/database.js';
import { ObjectId } from 'mongodb';
import { Item } from '../models/Item.js';

const collectionName = 'items';

/**
 * CREATE OPERATIONS
 */

/**
 * Create a new lost or found item
 * @param {Object} itemData - Item data object
 * @returns {Promise<Object>} Created item document
 */
export async function createItem(itemData) {
  try {
    const collection = getCollection(collectionName);
    // Convert userId string to ObjectId if needed
    const itemDataWithObjectId = {
      ...itemData,
      userId: itemData.userId ? new ObjectId(itemData.userId) : null
    };
    const item = new Item(itemDataWithObjectId);
    
    const result = await collection.insertOne(item);
    console.log(`✅ Item created: ${item.name} (${item.type})`);
    return { ...item, _id: result.insertedId };
  } catch (error) {
    console.error('❌ Error creating item:', error.message);
    throw error;
  }
}

/**
 * READ OPERATIONS
 */

/**
 * Find item by ID
 * @param {string} itemId - Item ID
 * @returns {Promise<Object|null>} Item document or null
 */
export async function findItemById(itemId) {
  try {
    const collection = getCollection(collectionName);
    return await collection.findOne({ _id: new ObjectId(itemId) });
  } catch (error) {
    console.error('❌ Error finding item by ID:', error.message);
    throw error;
  }
}

/**
 * Find all items
 * @param {Object} filter - Optional filter object
 * @returns {Promise<Array>} Array of item documents
 */
export async function findAllItems(filter = {}) {
  try {
    const collection = getCollection(collectionName);
    return await collection.find(filter).sort({ createdAt: -1 }).toArray();
  } catch (error) {
    console.error('❌ Error finding all items:', error.message);
    throw error;
  }
}

/**
 * Find items by type (lost or found)
 * @param {string} type - 'lost' or 'found'
 * @returns {Promise<Array>} Array of item documents
 */
export async function findItemsByType(type) {
  try {
    const collection = getCollection(collectionName);
    return await collection.find({ type, status: 'active' })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error('❌ Error finding items by type:', error.message);
    throw error;
  }
}

/**
 * Find items by location
 * @param {string} location - Location to search
 * @returns {Promise<Array>} Array of item documents
 */
export async function findItemsByLocation(location) {
  try {
    const collection = getCollection(collectionName);
    return await collection.find({ 
      location: { $regex: location, $options: 'i' },
      status: 'active'
    })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error('❌ Error finding items by location:', error.message);
    throw error;
  }
}

/**
 * Search items by name or description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching item documents
 */
export async function searchItems(searchTerm) {
  try {
    const collection = getCollection(collectionName);
    return await collection.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ],
      status: 'active'
    })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error('❌ Error searching items:', error.message);
    throw error;
  }
}

/**
 * UPDATE OPERATIONS
 */

/**
 * Update item details
 * @param {string} itemId - Item ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Update result
 */
export async function updateItem(itemId, updateData) {
  try {
    const collection = getCollection(collectionName);
    const result = await collection.updateOne(
      { _id: new ObjectId(itemId) },
      {
        $set: updateData
      }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('Item not found');
    }
    
    console.log(`✅ Item updated: ${itemId}`);
    return result;
  } catch (error) {
    console.error('❌ Error updating item:', error.message);
    throw error;
  }
}

/**
 * Mark item as resolved
 * @param {string} itemId - Item ID
 * @returns {Promise<Object>} Update result
 */
export async function markItemAsResolved(itemId) {
  try {
    const collection = getCollection(collectionName);
    const result = await collection.updateOne(
      { _id: new ObjectId(itemId) },
      {
        $set: {
          status: 'resolved'
        }
      }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('Item not found');
    }
    
    console.log(`✅ Item marked as resolved: ${itemId}`);
    return result;
  } catch (error) {
    console.error('❌ Error marking item as resolved:', error.message);
    throw error;
  }
}

/**
 * DELETE OPERATIONS
 */

/**
 * Delete item
 * @param {string} itemId - Item ID
 * @returns {Promise<Object>} Delete result
 */
export async function deleteItem(itemId) {
  try {
    const collection = getCollection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(itemId) });
    
    if (result.deletedCount === 0) {
      throw new Error('Item not found');
    }
    
    console.log(`✅ Item deleted: ${itemId}`);
    return result;
  } catch (error) {
    console.error('❌ Error deleting item:', error.message);
    throw error;
  }
}

/**
 * Delete all items (for cleanup/testing)
 * @returns {Promise<Object>} Delete result
 */
export async function deleteAllItems() {
  try {
    const collection = getCollection(collectionName);
    const result = await collection.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} items`);
    return result;
  } catch (error) {
    console.error('❌ Error deleting all items:', error.message);
    throw error;
  }
}

