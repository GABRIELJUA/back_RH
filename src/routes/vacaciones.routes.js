const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');


const { createVacacion, getVacaciones } = require('../controllers/vacaciones.controller');

// EMPLEADO → crear solicitud
router.post(
  '/',
  verifyToken,
  allowRoles('EMPLEADO'),
  createVacacion
);

// ADMIN RH → listar solicitudes
router.get(
  '/',
  verifyToken,
  allowRoles('ADMIN', 'ADMIN_EDITOR', 'ADMIN_LECTURA'),
  getVacaciones
);

module.exports = router;
