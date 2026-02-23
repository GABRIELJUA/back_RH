const express = require('express');
const router = express.Router();

const {
  crearComunicado,
  getComunicados,
  getById,
  updateComunicado,
  deleteComunicado,
  upload
} = require('../controllers/comunicadoController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

// ===== PUBLICO =====
router.get('/public', getComunicados);

// ===== ADMIN =====

// listar admin
router.get('/', verifyToken, getComunicados);

// crear
router.post(
  '/',
  verifyToken,
  allowRoles('ADMIN','ADMIN_EDITOR'),
  upload.single('archivo'),
  crearComunicado
);

// obtener 1
router.get(
  '/:id',
  verifyToken,
  getById
);

// editar
router.put(
  '/:id',
  verifyToken,
  allowRoles('ADMIN','ADMIN_EDITOR'),
  upload.single('archivo'),
  updateComunicado
);

// eliminar
router.delete(
  '/:id',
  verifyToken,
  allowRoles('ADMIN'),
  deleteComunicado
);

module.exports = router;
