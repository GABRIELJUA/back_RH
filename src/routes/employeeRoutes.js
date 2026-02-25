const express = require('express');
const router = express.Router();

const {
  getEmployees,
  getSystemUsers,
  register,
  updateEmployee,
  getEmployeeById,
  getMyProfile,
  updateMyProfile,
  updateEmployeePermissions,
  resetEmployeePassword
} = require('../controllers/employeeController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const {
  validateEmployeePayload,
  validateProfilePayload,
  validateResetPasswordPayload
} = require('../middlewares/validationMiddleware');

// ================== EMPLEADO ==================
router.get('/profile/me', verifyToken, getMyProfile);

router.put('/profile/me', verifyToken, validateProfilePayload, updateMyProfile);

// ================== ADMIN / RH ==================
router.get('/', verifyToken, allowRoles('ADMIN', 'ADMIN_EDITOR', 'ADMIN_LECTURA'), getEmployees);

router.get('/system-users', verifyToken, allowRoles('ADMIN', 'ADMIN_EDITOR', 'ADMIN_LECTURA'), getSystemUsers);

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


router.patch(
  '/:id/reset-password',
  verifyToken,
  allowRoles('ADMIN'),
  validateResetPasswordPayload,
  resetEmployeePassword
);

module.exports = router;
