const ROLES_VALIDOS = ['ADMIN', 'ADMIN_EDITOR', 'ADMIN_LECTURA', 'EMPLEADO'];

const validateLoginPayload = (req, res, next) => {
  const { num_nomina, password } = req.body;

  if (!num_nomina || !password) {
    return res.status(400).json({
      message: 'Número de nómina y contraseña son obligatorios'
    });
  }

  const cleanNomina = String(num_nomina).trim();
  if (!/^\d{4}$/.test(cleanNomina)) {
    return res.status(400).json({
      message: 'La nómina debe tener exactamente 4 números'
    });
  }

  req.body.num_nomina = cleanNomina;
  next();
};

const validateEmployeePayload = (req, res, next) => {
  const { num_nomina, password, rol } = req.body;

  if (!num_nomina || !password) {
    return res.status(400).json({
      message: 'Número de nómina y contraseña son obligatorios'
    });
  }

  const cleanNomina = String(num_nomina).trim();
  if (!/^\d{4}$/.test(cleanNomina)) {
    return res.status(400).json({
      message: 'La nómina debe tener exactamente 4 números'
    });
  }

  if (rol && !ROLES_VALIDOS.includes(rol)) {
    return res.status(400).json({
      message: 'Rol no válido'
    });
  }

  req.body.num_nomina = cleanNomina;
  next();
};

const validateProfilePayload = (req, res, next) => {
  const allowed = ['telefono', 'domicilio', 'estado_civil', 'correo'];
  const hasAnyField = allowed.some((field) => req.body[field] !== undefined);

  if (!hasAnyField) {
    return res.status(400).json({
      message: 'Debes enviar al menos un campo permitido para actualizar'
    });
  }

  next();
};

module.exports = {
  validateLoginPayload,
  validateEmployeePayload,
  validateProfilePayload,
  ROLES_VALIDOS
};
