const express = require('express');
const router = express.Router();
const { login , logout , me } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', logout);

// Ruta para obtener el perfil del usuario logueado
router.get('/me', verifyToken, me);

module.exports = router;