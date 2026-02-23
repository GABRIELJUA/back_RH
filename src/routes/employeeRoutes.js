const express = require('express');
const router = express.Router();

const {getEmployees, register, updateEmployee, getEmployeeById, getMyProfile, updateMyProfile, updateEmployeePermissions} = require('../controllers/employeeController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');


// ================== EMPLEADO ==================

// Perfil del usuario logueado (ADMIN o EMPLEADO)
router.get(
  '/profile/me',
  verifyToken,
  getMyProfile
);

// Actualizar su propio perfil
router.put(
  '/profile/me',
  verifyToken,
  updateMyProfile
);

// ================== ADMIN / RH ==================

// Ver lista de empleados
router.get(
  '/',
  verifyToken,
  allowRoles('ADMIN', 'ADMIN_EDITOR', 'ADMIN_LECTURA'),
  getEmployees
);

// Registrar empleado
router.post(
  '/register',
  verifyToken,
  allowRoles('ADMIN'),
  register
);

// Editar empleado
router.put(
  '/edit/:id',
  verifyToken,
  allowRoles('ADMIN', 'ADMIN_EDITOR'),
  updateEmployee
);

// Ver empleado por ID
router.get(
  '/:id',
  verifyToken,
  allowRoles('ADMIN', 'ADMIN_EDITOR', 'ADMIN_LECTURA'),
  getEmployeeById
);

// Actualizar permisos
router.patch(
  '/permissions/:id',
  verifyToken,
  allowRoles('ADMIN'),
  updateEmployeePermissions
);


module.exports = router;
