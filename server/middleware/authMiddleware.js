// EzLabs/server/middleware/authMiddleware.js - CORRECTED EXPORT
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // console.log('--- Entering protect middleware ---');
  // console.log('Authorization Header:', req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // console.log('Extracted Token:', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('Decoded Token:', decoded);

      // This was the fix we implemented earlier
      req.user = decoded.user;
      // console.log('req.user set to:', req.user);
      next();
    } catch (error) {
      console.error('Token verification failed inside middleware:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else { // Added an 'else' block here for clarity, though it's logically similar to the !token check
    // console.log('No Authorization header or not starting with Bearer.');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // The original `if (!token)` check is essentially redundant if the `else` above is hit.
  // But keeping it just in case if there's any path where token isn't set but no header starts with Bearer
  // if (!token) {
  //   console.log('No token found in header.');
  //   return res.status(401).json({ message: 'Not authorized, no token' });
  // }
  // console.log('--- Exiting protect middleware (should not reach here if no token or error) ---');
};

// Ensure 'protect' is defined before it's exported
module.exports = { protect }; // <--- Make absolutely sure this line is exactly here and correct

// Remove debugging logs at the end, or keep them for now
// console.log('Type of protect function:', typeof protect);