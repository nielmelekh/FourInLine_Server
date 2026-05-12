function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.header("x-user-role");

try {
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403);
      throw new Error("Forbidden: You do not have permission to perform this action.", { userRole });
    }
}
catch (err) {
    return next(err);
    }
  };
}


module.exports = authorizeRoles;