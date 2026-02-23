const db = require('../config/db');

const create = async ({ user_id, action, entity, entity_id, details }) => {
  try {
    await db.query(
      `INSERT INTO audit_log (user_id, action, entity, entity_id, details)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id || null, action, entity, entity_id || null, JSON.stringify(details || {})]
    );
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.warn('Tabla audit_log no existe. Se omitió registro de auditoría.');
      return;
    }
    throw error;
  }
};

module.exports = { create };
