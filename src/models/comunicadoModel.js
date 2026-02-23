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
const getAll = async () => {
  const [rows] = await db.query(`
    SELECT c.*,
    CONCAT(e.nombre,' ',e.apellido_paterno) as autor
    FROM comunicados c
    LEFT JOIN empleados e ON e.id_empleado = c.creado_por
    ORDER BY fecha_publicacion DESC, id_comunicado DESC
  `);

  return rows;
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
