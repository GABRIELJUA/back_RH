const db = require('../config/db');

// ================= CREAR =================
const create = async (data) => {
  const { titulo, contenido, archivo_url, fecha_publicacion, creado_por } = data;

  const sql = `
    INSERT INTO comunicados
    (titulo, contenido, archivo_url, fecha_publicacion, creado_por)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    titulo,
    contenido,
    archivo_url || null,
    fecha_publicacion,
    creado_por
  ]);

  return result.insertId;
};

// ================= OBTENER TODOS =================
const getAll = async (filters = {}, pagination = null) => {
  const whereClauses = [];
  const values = [];

  if (filters.categoria) {
    whereClauses.push('(c.titulo LIKE ? OR c.contenido LIKE ?)');
    const categoriaTerm = `%${filters.categoria}%`;
    values.push(categoriaTerm, categoriaTerm);
  }

  if (filters.fecha_desde) {
    whereClauses.push('DATE(c.fecha_publicacion) >= ?');
    values.push(filters.fecha_desde);
  }

  if (filters.fecha_hasta) {
    whereClauses.push('DATE(c.fecha_publicacion) <= ?');
    values.push(filters.fecha_hasta);
  }

  if (filters.q) {
    whereClauses.push('(c.titulo LIKE ? OR c.contenido LIKE ?)');
    const term = `%${filters.q}%`;
    values.push(term, term);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const baseQuery = `
    SELECT c.*,
    CONCAT(e.nombre,' ',e.apellido_paterno) as autor
    FROM comunicados c
    LEFT JOIN empleados e ON e.id_empleado = c.creado_por
    ${whereSql}
    ORDER BY c.fecha_publicacion DESC, c.id_comunicado DESC
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
    `SELECT COUNT(*) AS total FROM comunicados c ${whereSql}`,
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

// ================= OBTENER POR ID =================
const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM comunicados WHERE id_comunicado=?`,
    [id]
  );
  return rows[0];
};

// ================= ACTUALIZAR =================
const update = async (id, data) => {
  const { titulo, contenido, archivo_url, fecha_publicacion } = data;

  const sql = `
    UPDATE comunicados SET
      titulo=?,
      contenido=?,
      archivo_url=?,
      fecha_publicacion=?
    WHERE id_comunicado=?
  `;

  const [result] = await db.query(sql, [
    titulo,
    contenido,
    archivo_url,
    fecha_publicacion,
    id
  ]);

  return result.affectedRows > 0;
};

// ================= ELIMINAR =================
const remove = async (id) => {
  const [result] = await db.query(
    'DELETE FROM comunicados WHERE id_comunicado=?',
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  findById,
  update,
  remove
};
