# Lost & Found Items Website

A web application for reporting and viewing lost or found items, built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## Features

- ✅ User authentication (Sign up / Login)
- ✅ Add lost or found items (name, description, location)
- ✅ View all items with filtering options
- ✅ Search items by name, description, or location
- ✅ Delete items (only your own items)
- ✅ Filter by type (lost/found)
- ✅ User accounts linked to items

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: Express Sessions

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure MongoDB Atlas:
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string
   - Update `.env` file with your connection string

3. Start the server:
```bash
npm start
```

4. Open your browser:
```
http://localhost:3000
```

## Project Structure

```
pa-mini-project/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Item.js               # Item data model
│   └── User.js               # User data model
├── operations/
│   ├── itemsOperations.js    # Items CRUD operations
│   └── usersOperations.js    # Users CRUD operations
├── middleware/
│   └── auth.js               # Authentication middleware
├── public/
│   ├── index.html            # Main page
│   ├── login.html            # Login/Sign up page
│   ├── script.js             # Frontend JavaScript
│   └── style.css             # Styling
├── documentation/
│   ├── collections.md        # Collections documentation
│   ├── crud_operations.md     # CRUD operations documentation
│   └── presentation_outline.md # Presentation outline
├── server.js                 # Express server
└── package.json              # Dependencies
```

## MongoDB Collections

### Users Collection
Stores user accounts with authentication credentials.

### Items Collection
Stores lost and found items, linked to users.

See `documentation/` folder for detailed collection schemas and CRUD operations.

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `DELETE /api/items/:id` - Delete item

## For Presentation

See `documentation/` folder for:
- Collection definitions
- CRUD operations with MongoDB commands
- Presentation outline
