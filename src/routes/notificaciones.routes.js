const express = require('express');
const router = express.Router();
const { getNotificacionesAdmin, marcarComoLeida, countNoLeidasAdmin } = require('../controllers/notificaciones.controller');

const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, getNotificacionesAdmin);
router.get('/no-leidas', verifyToken, countNoLeidasAdmin);
router.put('/:id/leida', verifyToken, marcarComoLeida);

module.exports = router;
