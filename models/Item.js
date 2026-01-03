/**
 * Item Model
 * Represents a lost or found item
 */
export class Item {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.location = data.location;
    this.type = data.type; // 'lost' or 'found'
    this.contactInfo = data.contactInfo || '';
    this.userId = data.userId; // User who posted this item
    this.createdAt = data.createdAt || new Date();
    this.status = data.status || 'active'; // 'active' or 'resolved'
    this.imageUrl = data.imageUrl || null;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      location: this.location,
      type: this.type,
      contactInfo: this.contactInfo,
      createdAt: this.createdAt,
      status: this.status,
      imageUrl: this.imageUrl
    };
  }
}

