const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({
        message: 'No tienes permisos para realizar esta acción'
      });
    }
    next();
  };
};

module.exports = { allowRoles };
