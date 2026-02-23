const express = require('express');
const router = express.Router();
const uploadSugerencia = require('../middlewares/uploadSugerencias');
const {
  createSugerencia,
  getSugerencias
} = require('../controllers/sugerenciaController');

// Crear sugerencia (ANÓNIMA)
router.post(
  '/',
  uploadSugerencia.single('imagen'),
  createSugerencia
);

// Listar sugerencias (admin)
router.get('/', getSugerencias);

module.exports = router;
