const db = require('../config/db');

const create = async (comentario, imagen) => {
  const [result] = await db.query(
    'INSERT INTO sugerencias (comentario, imagen) VALUES (?, ?)',
    [comentario, imagen]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(
    'SELECT * FROM sugerencias ORDER BY fecha DESC'
  );
  return rows;
};

module.exports = { create, getAll };
