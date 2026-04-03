const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Not authorized to access this route: User role not found.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Not authorized to access this route: Role '${req.user.role}' is not allowed.`
      });
    }

    next();
  };
};

module.exports = { authorizeRoles }; 
