// EzLabs/server/middleware/roleMiddleware.js - VERIFY THIS CODE
// Middleware to check if the authenticated user has the 'admin' role

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user should be available from the 'protect' middleware
    if (!req.user || !req.user.role) {
      // This case usually means protect middleware didn't run or token was bad
      return res.status(403).json({ message: 'Not authorized to access this route: User role not found.' });
    }

    // Check if the user's role is included in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Not authorized to access this route: Role '${req.user.role}' is not allowed.`
      });
    }

    // If authorized, proceed to the next middleware or route handler
    next();
  };
};

module.exports = { authorizeRoles }; // Make sure this line exports it correctly

// EzLabs/server/middleware/roleMiddleware.js - Add this at the very end
// console.log('Type of authorizeRoles function:', typeof authorizeRoles);
// console.log('Type of authorizeRoles("admin") result:', typeof authorizeRoles('admin'));