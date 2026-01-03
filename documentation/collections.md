# Collections Documentation

## Items Collection

### Definition

The **Items** collection stores all lost and found items reported by users. Each document represents a single item with its details, location, type (lost or found), and status.

### Purpose

This collection is used for:
- Storing lost item reports
- Storing found item reports
- Enabling users to search and match lost items with found items
- Tracking item status (active or resolved)
- Managing item information and contact details

### Schema Structure

```javascript
{
  _id: ObjectId,                    // Unique item identifier
  name: String,                     // Item name (e.g., "iPhone 13", "Black Wallet")
  description: String,              // Detailed description of the item
  location: String,                 // Where the item was lost or found
  type: String,                     // "lost" or "found"
  contactInfo: String,              // Contact information (email or phone)
  status: String,                   // "active" or "resolved"
  imageUrl: String,                 // Optional image URL
  createdAt: Date                   // When the item was reported
}
```

### Example Document

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "iPhone 13 Pro",
  description: "Black iPhone 13 Pro with a blue case. Screen has a small crack on the top right corner.",
  location: "Main Library, 2nd Floor",
  type: "lost",
  contactInfo: "john.doe@example.com",
  status: "active",
  imageUrl: null,
  createdAt: ISODate("2026-01-15T10:30:00Z")
}
```

### Relationships

- **Standalone Collection**: The Items collection is independent and doesn't have direct foreign key relationships with other collections in this simple application.
- **Self-referential**: Items can be matched (lost items with found items) based on description and location, but this is handled at the application level rather than through database relationships.

