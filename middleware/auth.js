/**
 * Authentication Middleware
 */

/**
 * Check if user is authenticated
 */
export function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  
  // If it's an API request, return JSON error
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required' 
    });
  }
  
  // Otherwise redirect to login
  res.redirect('/login');
}

/**
 * Check if user is NOT authenticated (for login/register pages)
 */
export function requireGuest(req, res, next) {
  if (req.session && req.session.userId) {
    // If it's an API request, return JSON error
    if (req.path.startsWith('/api/')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Already logged in. Please logout first.' 
      });
    }
    // Otherwise redirect to home
    return res.redirect('/');
  }
  next();
}

/**
 * Get current user (optional - doesn't require auth)
 */
export async function getCurrentUser(req) {
  if (req.session && req.session.userId) {
    const { findUserById } = await import('../operations/usersOperations.js');
    return await findUserById(req.session.userId);
  }
  return null;
}

