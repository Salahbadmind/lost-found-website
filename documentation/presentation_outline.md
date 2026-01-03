# Lost & Found Items Website - Presentation Outline

## 1. Introduction

### a. Idea/Application/System/Project

**Lost & Found Items Website** is a web application designed to help people report and find lost or found items. The system allows users to post items they have lost or found, search for items, and connect with others to reunite items with their owners. It provides a simple, user-friendly platform for managing lost and found items in a community setting.

### b. Users

The system serves two main types of users:

1. **People who lost items**: Users who have lost personal belongings and want to report them in hopes of finding them
2. **People who found items**: Users who have found items and want to report them to help return them to their owners

### c. Problems It Solves

1. **Difficulty in Finding Lost Items**: Provides a centralized platform where people can report lost items and others can search for them
2. **Difficulty in Returning Found Items**: Allows people who find items to easily report them so owners can locate their belongings
3. **Lack of Communication**: Enables contact between item owners and finders through contact information
4. **Organization**: Helps organize and categorize lost and found items by type and location
5. **Accessibility**: Provides an easy-to-use web interface accessible from any device

---

## 2. Collections

### Collection: Items

**Purpose**: Stores all lost and found items reported by users. Each document represents a single item with its details including name, description, location, type (lost or found), contact information, and status. This is the main and only collection in this application, as it is designed to be simple and focused.

---

## 3. Database Modeling

### 3.1 Items Collection

#### a. Definition of Collection

The **Items** collection stores all lost and found items in the system. It is used to:
- Store item reports from users who have lost or found items
- Enable searching and matching of lost items with found items
- Track item status (active or resolved)
- Store contact information for communication between users

#### b. CRUD Operations

**CREATE Operations:**
1. **Create New Item** - Adds a new lost or found item to the database
2. **Create Multiple Items (Bulk Insert)** - Adds multiple items at once

**READ Operations:**
3. **Find Item by ID** - Retrieves a specific item by its unique identifier
4. **Find All Items** - Retrieves all items in the collection
5. **Find Active Items** - Retrieves only items with active status
6. **Find Items by Type** - Retrieves items filtered by type (lost or found)
7. **Find Items by Location** - Searches items by location
8. **Search Items by Name or Description** - Searches items using text matching
9. **Find Items by Status** - Retrieves items filtered by status

**UPDATE Operations:**
10. **Update Item Details** - Modifies item information
11. **Mark Item as Resolved** - Changes item status to resolved
12. **Update Item Type** - Changes item type (lost/found)
13. **Update Item Location** - Updates location information

**DELETE Operations:**
14. **Delete Item** - Removes a single item from the database
15. **Delete All Items by Type** - Removes all items of a specific type
16. **Delete All Resolved Items** - Removes all resolved items
17. **Delete All Items** - Removes all items (cleanup)

#### c. Examples

**Example 1: Create Operation**

**Description**: Creates a new lost item report. This operation is essential for users to report items they have lost, storing all necessary information to help others identify and return the item.

**MongoDB Command**:
```javascript
db.items.insertOne({
  name: "iPhone 13 Pro",
  description: "Black iPhone 13 Pro with a blue case. Screen has a small crack on the top right corner.",
  location: "Main Library, 2nd Floor",
  type: "lost",
  contactInfo: "john.doe@example.com",
  status: "active",
  createdAt: new Date()
})
```

**Triggered Operations**: None (new item has no related data)

---

**Example 2: Read Operation**

**Description**: Finds all active lost items. This operation is used to display a list of lost items on the website, helping users see what items are currently being searched for.

**MongoDB Command**:
```javascript
db.items.find({ type: "lost", status: "active" }).sort({ createdAt: -1 })
```

**Triggered Operations**: None

---

**Example 3: Update Operation**

**Description**: Marks an item as resolved when it has been found and returned to its owner. This operation updates the status field to indicate the item is no longer active.

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

**Example 4: Delete Operation**

**Description**: Permanently removes an item from the database. This operation is used when an item report is no longer needed, was posted by mistake, or contains inappropriate content.

**MongoDB Command**:
```javascript
db.items.deleteOne({ _id: ObjectId("507f1f77bcf86cd799439011") })
```

**Triggered Operations**: None (Items collection is standalone with no foreign key relationships in this simple application. In a more complex system with user accounts, comments, or other related collections, triggered operations would be necessary to maintain referential integrity.)

---

## 4. Conclusion

This Lost & Found Items Website demonstrates a practical application of MongoDB for a simple but useful real-world system. The project showcases:

- **Simple Schema Design**: A single collection that effectively stores all necessary information
- **Complete CRUD Operations**: Full Create, Read, Update, and Delete functionality for managing items
- **Practical Application**: Solves a real problem that many people face
- **User-Friendly Interface**: Clean HTML/CSS/JavaScript frontend for easy interaction
- **Scalability Potential**: The simple design allows for future enhancements such as user accounts, comments, image uploads, and matching algorithms

While this application uses a standalone collection without complex relationships, it effectively demonstrates MongoDB's flexibility and ease of use for building practical web applications. The project provides a solid foundation that could be extended with additional features and collections as needed.

