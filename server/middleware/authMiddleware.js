// EzLabs/server/middleware/authMiddleware.js - ADD CONSOLE.LOGS
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  console.log('--- Entering protect middleware ---'); // NEW LOG
  console.log('Authorization Header:', req.headers.authorization); // NEW LOG

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];
      console.log('Extracted Token:', token); // NEW LOG

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); // NEW LOG

      // Attach decoded user ID to the request object
      req.user = decoded.user.id; // Assuming your JWT payload has an 'id' field for the user ID
      console.log('req.user set to:', req.user); // NEW LOG
      next(); // Move to the next middleware/route handler
    } catch (error) {
      console.error('Token verification failed inside middleware:', error); // MODIFIED LOG
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log('No token found in header.'); // NEW LOG
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  console.log('--- Exiting protect middleware (should not reach here if no token) ---'); // NEW LOG
};

module.exports = { protect };