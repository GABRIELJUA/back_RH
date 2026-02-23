const notificacionesModel = require('../models/notificaciones.model');

/**
 * 🔔 Obtener notificaciones administrativas
 * Solo ADMIN, ADMIN_EDITOR, ADMIN_LECTURA
 */
const getNotificacionesAdmin = async (req, res) => {
  try {
    const notificaciones = await notificacionesModel.getAdminNotificaciones();
    res.json(notificaciones);
  } catch (error) {
    console.error('Error al obtener notificaciones admin:', error);
    res.status(500).json({
      message: 'Error al obtener notificaciones'
    });
  }
};

/**
 * 🔢 Contar notificaciones no leídas (ADMIN)
 */
const countNoLeidasAdmin = async (req, res) => {
  try {
    const total = await notificacionesModel.countAdminNoLeidas();
    res.json(total);
  } catch (error) {
    console.error('Error al contar notificaciones:', error);
    res.status(500).json({
      message: 'Error al contar notificaciones'
    });
  }
};

/**
 * ✅ Marcar notificación como leída
 */
const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    await notificacionesModel.marcarComoLeida(id);

    res.json({
      message: 'Notificación marcada como leída'
    });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({
      message: 'Error al actualizar notificación'
    });
  }
};

module.exports = {
  getNotificacionesAdmin,
  countNoLeidasAdmin,
  marcarComoLeida
};
