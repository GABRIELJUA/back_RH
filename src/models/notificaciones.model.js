const db = require('../config/db');

/**
 * Crear notificación administrativa
 */
const createAdmin = async (titulo, mensaje, tipo, url) => {
  const [result] = await db.query(
    `INSERT INTO notificaciones (titulo, mensaje, tipo, url)
     VALUES (?, ?, ?, ?)`,
    [titulo, mensaje, tipo, url]
  );

  return result.insertId;
};

/**
 * Obtener notificaciones admin
 */
const getAdminNotificaciones = async () => {
  const [rows] = await db.query(
    `SELECT *
     FROM notificaciones
     ORDER BY created_at DESC
     LIMIT 20`
  );

  return rows;
};

/**
 * Marcar como leída
 */
const marcarComoLeida = async (id) => {
  await db.query(
    `UPDATE notificaciones
     SET leida = 1
     WHERE id = ?`,
    [id]
  );
};

/**
 * Contar no leídas (admin)
 */
const countAdminNoLeidas = async () => {
  const [[row]] = await db.query(
    `SELECT COUNT(*) AS total
     FROM notificaciones
     WHERE leida = 0`
  );

  return row.total;
};

module.exports = {
  createAdmin,
  getAdminNotificaciones,
  marcarComoLeida,
  countAdminNoLeidas
};
