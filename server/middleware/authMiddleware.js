// EzLabs/server/middleware/authMiddleware.js - VERIFY THIS EXACTLY
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the entire user object (containing id and role) from the payload
      req.user = decoded.user; // This is the crucial line we fixed recently

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Token verification failed inside middleware:', error);
      // Don't throw, send response
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // No token provided in header
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect }; // <--- THIS IS CRITICAL: Ensure 'protect' is defined above and correctly exported