import express from 'express';
import session from 'express-session';
import { connectDB } from './config/database.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Import operations - MongoDB
import {
  createItem,
  findAllItems,
  findItemById,
  findItemsByType,
  findItemsByLocation,
  searchItems,
  updateItem,
  markItemAsResolved,
  deleteItem
} from './operations/itemsOperations.js';

// Import user operations
import {
  createUser,
  authenticateUser,
  findUserById
} from './operations/usersOperations.js';

// Import middleware
import { requireAuth, requireGuest, getCurrentUser } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'lost-found-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Connect to MongoDB - wait for connection before starting server
let dbConnected = false;

// Make current user available to all routes
app.use(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      req.user = await findUserById(req.session.userId);
    } catch (error) {
      req.session.userId = null;
      req.user = null;
    }
  }
  next();
});

// Routes

// Serve login page
app.get('/login', requireGuest, (req, res) => {
  res.sendFile(join(__dirname, 'public', 'login.html'));
});

// Serve main page (require auth)
app.get('/', requireAuth, (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Authentication Routes

// Register
app.post('/api/auth/register', requireGuest, async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }
    
    const user = await createUser({
      username,
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || ''
    });
    
    // Auto-login after registration
    req.session.userId = user._id.toString();
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login
app.post('/api/auth/login', requireGuest, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }
    
    const user = await authenticateUser(username, password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }
    
    // Set session
    req.session.userId = user._id.toString();
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to logout' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Get current user
app.get('/api/auth/me', requireAuth, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// API Routes (require authentication)

// Get all items
app.get('/api/items', requireAuth, async (req, res) => {
  try {
    const { type, location, search } = req.query;
    
    let items;
    if (type) {
      items = await findItemsByType(type);
    } else if (location) {
      items = await findItemsByLocation(location);
    } else if (search) {
      items = await searchItems(search);
    } else {
      items = await findAllItems({ status: 'active' });
    }
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get item by ID
app.get('/api/items/:id', requireAuth, async (req, res) => {
  try {
    const item = await findItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new item (require auth)
app.post('/api/items', requireAuth, async (req, res) => {
  try {
    const { name, description, location, type, contactInfo, imageUrl } = req.body;
    
    if (!name || !description || !location || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, description, location, type'
      });
    }
    
    if (type !== 'lost' && type !== 'found') {
      return res.status(400).json({
        success: false,
        error: 'Type must be either "lost" or "found"'
      });
    }
    
    const item = await createItem({
      name,
      description,
      location,
      type,
      contactInfo: contactInfo || '',
      imageUrl: imageUrl || null,
      userId: req.user._id.toString() // Link item to user
    });
    
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update item (require auth - only owner can update)
app.put('/api/items/:id', requireAuth, async (req, res) => {
  try {
    const item = await findItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    // Check if user owns this item
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'You can only update your own items' });
    }
    
    await updateItem(req.params.id, req.body);
    const updatedItem = await findItemById(req.params.id);
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark item as resolved
app.patch('/api/items/:id/resolve', requireAuth, async (req, res) => {
  try {
    const item = await findItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    // Check if user owns this item
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'You can only resolve your own items' });
    }
    
    await markItemAsResolved(req.params.id);
    res.json({ success: true, message: 'Item marked as resolved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete item (require auth - only owner can delete)
app.delete('/api/items/:id', requireAuth, async (req, res) => {
  try {
    const item = await findItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    // Check if user owns this item
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'You can only delete your own items' });
    }
    
    await deleteItem(req.params.id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server only after MongoDB is connected
async function startServer() {
  try {
    // Connect to database first
    console.log('🔌 Connecting to MongoDB Atlas...');
    await connectDB();
    dbConnected = true;
    console.log('✅ Database connected and ready');
    
    // Start server only after database is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Open http://localhost:${PORT} in your browser`);
      console.log('✅ MongoDB Atlas connected - Data will be persisted');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your .env file has correct MONGODB_URI');
    console.log('2. Verify your Atlas connection string');
    console.log('3. Make sure your IP is whitelisted in Atlas');
    console.log('4. Run: node test-connection.js to test connection');
    process.exit(1);
  }
}

// Start the server
startServer();
