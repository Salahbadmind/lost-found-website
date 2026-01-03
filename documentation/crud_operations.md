# Items Collection - CRUD Operations

## Collection Definition

The **Items** collection stores all lost and found items reported by users. Each document contains item details including name, description, location, type (lost/found), contact information, and status.

---

## CREATE Operations

### 1. Create New Item

**Description**: Creates a new lost or found item in the system. This operation is essential for users to report items they have lost or found. It stores all relevant information needed to help reunite items with their owners.

**MongoDB Command**:
```javascript
db.items.insertOne({
  name: "iPhone 13 Pro",
  description: "Black iPhone 13 Pro with a blue case. Screen has a small crack on the top right corner.",
  location: "Main Library, 2nd Floor",
  type: "lost",
  contactInfo: "john.doe@example.com",
  status: "active",
  imageUrl: null,
  createdAt: new Date()
})
```

**Triggered Operations**: None (new item has no related data)

---

### 2. Create Multiple Items (Bulk Insert)

**Description**: Creates multiple items at once. Useful for initial system setup, importing items from another system, or bulk data entry.

**MongoDB Command**:
```javascript
db.items.insertMany([
  {
    name: "Black Wallet",
    description: "Leather wallet containing credit cards and ID",
    location: "Parking Lot A",
    type: "found",
    contactInfo: "security@campus.edu",
    status: "active",
    createdAt: new Date()
  },
  {
    name: "Blue Backpack",
    description: "Nike blue backpack with laptop inside",
    location: "Cafeteria",
    type: "lost",
    contactInfo: "student@example.com",
    status: "active",
    createdAt: new Date()
  }
])
```

**Triggered Operations**: None

---

## READ Operations

### 3. Find Item by ID

**Description**: Retrieves a specific item document by its unique ObjectId. Used when displaying item details or when you have a reference to an item from another operation.

**MongoDB Command**:
```javascript
db.items.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })
```

**Triggered Operations**: None

---

### 4. Find All Items

**Description**: Retrieves all items in the collection. Used to display the complete list of lost and found items on the main page.

**MongoDB Command**:
```javascript
db.items.find({}).sort({ createdAt: -1 })
```

**Triggered Operations**: None

---

### 5. Find Active Items Only

**Description**: Retrieves only items with "active" status, excluding resolved items. Used to show only items that are still looking for matches.

**MongoDB Command**:
```javascript
db.items.find({ status: "active" }).sort({ createdAt: -1 })
```

**Triggered Operations**: None

---

### 6. Find Items by Type (Lost or Found)

**Description**: Retrieves all items of a specific type (lost or found). Used for filtering the display to show only lost items or only found items.

**MongoDB Command**:
```javascript
// Find all lost items
db.items.find({ type: "lost", status: "active" }).sort({ createdAt: -1 })

// Find all found items
db.items.find({ type: "found", status: "active" }).sort({ createdAt: -1 })
```

**Triggered Operations**: None

---

### 7. Find Items by Location

**Description**: Searches for items by location using case-insensitive regex matching. Used to help users find items lost or found in a specific area.

**MongoDB Command**:
```javascript
db.items.find({
  location: { $regex: "Library", $options: "i" },
  status: "active"
}).sort({ createdAt: -1 })
```

**Triggered Operations**: None

---

### 8. Search Items by Name or Description

**Description**: Searches for items by name or description using case-insensitive regex matching. Used for the search functionality to help users find specific items.

**MongoDB Command**:
```javascript
db.items.find({
  $or: [
    { name: { $regex: "iPhone", $options: "i" } },
    { description: { $regex: "iPhone", $options: "i" } }
  ],
  status: "active"
}).sort({ createdAt: -1 })
```

**Triggered Operations**: None

---

### 9. Find Items by Status

**Description**: Retrieves items with a specific status (active or resolved). Used for administrative purposes or to show resolved items separately.

**MongoDB Command**:
```javascript
// Find resolved items
db.items.find({ status: "resolved" }).sort({ createdAt: -1 })

// Find active items
db.items.find({ status: "active" }).sort({ createdAt: -1 })
```

**Triggered Operations**: None

---

## UPDATE Operations

### 10. Update Item Details

**Description**: Updates any field(s) of an item document. Allows users to modify item information such as description, location, or contact information.

**MongoDB Command**:
```javascript
db.items.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  {
    $set: {
      description: "Updated description with more details",
      location: "Updated location information",
      contactInfo: "newemail@example.com"
    }
  }
)
```

**Triggered Operations**: None (updating item details doesn't affect other documents)

---

### 11. Mark Item as Resolved

**Description**: Changes an item's status from "active" to "resolved". Used when a lost item has been found and returned to its owner, or when a found item has been claimed.

**MongoDB Command**:
```javascript
db.items.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  {
    $set: {
      status: "resolved"
    }
  }
)
```

**Triggered Operations**: None (status change doesn't require cascading updates)

---

### 12. Update Item Type

**Description**: Changes an item's type from "lost" to "found" or vice versa. Used when a user incorrectly categorizes an item and needs to correct it.

**MongoDB Command**:
```javascript
db.items.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  {
    $set: {
      type: "found"
    }
  }
)
```

**Triggered Operations**: None

---

### 13. Update Item Location

**Description**: Updates the location field of an item. Used when more accurate location information becomes available.

**MongoDB Command**:
```javascript
db.items.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  {
    $set: {
      location: "Building B, Room 205"
    }
  }
)
```

**Triggered Operations**: None

---

## DELETE Operations

### 14. Delete Item

**Description**: Permanently removes an item document from the collection. Used when an item report is no longer needed, was posted by mistake, or contains inappropriate content.

**MongoDB Command**:
```javascript
db.items.deleteOne({ _id: ObjectId("507f1f77bcf86cd799439011") })
```

**Triggered Operations**: None (Items collection is standalone with no foreign key relationships in this simple application)

---

### 15. Delete All Items by Type

**Description**: Deletes all items of a specific type (lost or found). Used for administrative cleanup or testing purposes.

**MongoDB Command**:
```javascript
// Delete all lost items
db.items.deleteMany({ type: "lost" })

// Delete all found items
db.items.deleteMany({ type: "found" })
```

**Triggered Operations**: None

---

### 16. Delete All Resolved Items

**Description**: Deletes all items with "resolved" status. Used for periodic cleanup of old resolved items to keep the database clean.

**MongoDB Command**:
```javascript
db.items.deleteMany({ status: "resolved" })
```

**Triggered Operations**: None

---

### 17. Delete All Items (Cleanup)

**Description**: Deletes all items from the collection. Used for testing, resetting the database, or complete cleanup.

**MongoDB Command**:
```javascript
db.items.deleteMany({})
```

**Triggered Operations**: None

---

## Summary

The Items collection is a standalone collection with no foreign key relationships in this simple application. Therefore, DELETE operations do not require triggered operations (cascading deletes) since there are no related documents in other collections that depend on items. 

However, in a more complex system, if items were linked to user accounts, comments, or other collections, triggered operations would be necessary to maintain referential integrity.

