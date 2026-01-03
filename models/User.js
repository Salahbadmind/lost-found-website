/**
 * User Model
 * Represents a user account
 */
export class User {
  constructor(data) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password; // Should be hashed
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.createdAt = data.createdAt || new Date();
    this.lastLogin = data.lastLogin || null;
  }

  toJSON() {
    return {
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }
}

