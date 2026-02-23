const db = require('../config/db');

// ================== SUBIR ARCHIVO ==================
const create = async (data) => {
  const { titulo, descripcion, categoria, archivo_url, subido_por } = data;

  const query = `
    INSERT INTO biblioteca (titulo, descripcion, categoria, archivo_url, subido_por)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    titulo,
    descripcion,
    categoria,
    archivo_url,
    subido_por
  ]);

  return result.insertId;
};

// ================== LISTAR ==================
const getAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      b.*,
      CONCAT(e.nombre,' ',e.apellido_paterno) AS subido_nombre
    FROM biblioteca b
    LEFT JOIN empleados e ON e.id_empleado = b.subido_por
    ORDER BY b.fecha_subida DESC
  `);

  return rows;
};

// ================== ELIMINAR ==================
const remove = async (id) => {
  const [result] = await db.query(
    'DELETE FROM biblioteca WHERE id = ?',
    [id]
  );
  return result.affectedRows;
};

// ================== OBTENER POR ID ==================
const findById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM biblioteca WHERE id = ?',
    [id]
  );
  return rows[0];
};

const getPublic = async () => {
  const [rows] = await db.query(`
    SELECT id, titulo, categoria, archivo_url, fecha_subida
    FROM biblioteca
    ORDER BY fecha_subida DESC
  `);

  return rows;
};


module.exports = {
  create,
  getAll,
  remove,
  findById,
  getPublic
};
