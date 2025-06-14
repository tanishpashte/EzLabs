// EzLabs/server/middleware/authMiddleware.js - ADD CONSOLE.LOGS
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;


  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded user ID to the request object
      req.user = decoded.user.id; // Assuming your JWT payload has an 'id' field for the user ID
      next(); // Move to the next middleware/route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };