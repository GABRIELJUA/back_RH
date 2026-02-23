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
const getAll = async (filters = {}, pagination = null) => {
  const whereClauses = [];
  const values = [];

  if (filters.categoria) {
    whereClauses.push('b.categoria = ?');
    values.push(filters.categoria);
  }

  if (filters.q) {
    whereClauses.push('(b.titulo LIKE ? OR b.descripcion LIKE ?)');
    const term = `%${filters.q}%`;
    values.push(term, term);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const baseQuery = `
    SELECT 
      b.*,
      CONCAT(e.nombre,' ',e.apellido_paterno) AS subido_nombre
    FROM biblioteca b
    LEFT JOIN empleados e ON e.id_empleado = b.subido_por
    ${whereSql}
    ORDER BY b.fecha_subida DESC
  `;

  if (!pagination) {
    const [rows] = await db.query(baseQuery, values);
    return rows;
  }

  const [rows] = await db.query(
    `${baseQuery} LIMIT ? OFFSET ?`,
    [...values, pagination.limit, pagination.offset]
  );

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM biblioteca b ${whereSql}`,
    values
  );

  return {
    data: rows,
    total: countRows[0].total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(countRows[0].total / pagination.limit)
  };
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
