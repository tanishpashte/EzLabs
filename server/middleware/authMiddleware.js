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
      req.user = decoded.user; 

      next(); 
    } catch (error) {
      console.error('Token verification failed inside middleware:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // No token provided in header
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect }; 