const express = require('express');
const router = express.Router();

const {
  getEmployees,
  register,
  updateEmployee,
  getEmployeeById,
  getMyProfile,
  updateMyProfile,
  updateEmployeePermissions
} = require('../controllers/employeeController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const {
  validateEmployeePayload,
  validateProfilePayload
} = require('../middlewares/validationMiddleware');

// ================== EMPLEADO ==================
router.get('/profile/me', verifyToken, getMyProfile);

router.put('/profile/me', verifyToken, validateProfilePayload, updateMyProfile);

// ================== ADMIN / RH ==================
router.get('/', verifyToken, allowRoles('ADMIN', 'ADMIN_EDITOR', 'ADMIN_LECTURA'), getEmployees);

router.post(
  '/register',
  verifyToken,
  allowRoles('ADMIN'),
  validateEmployeePayload,
  register
);

router.put('/edit/:id', verifyToken, allowRoles('ADMIN', 'ADMIN_EDITOR'), updateEmployee);

router.get('/:id', verifyToken, allowRoles('ADMIN', 'ADMIN_EDITOR', 'ADMIN_LECTURA'), getEmployeeById);

router.patch('/permissions/:id', verifyToken, allowRoles('ADMIN'), updateEmployeePermissions);

module.exports = router;
