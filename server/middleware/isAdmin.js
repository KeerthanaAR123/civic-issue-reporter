const isAdmin = (req, res, next) => {
  // Checks if the user object exists and if the role is admin
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = isAdmin;
