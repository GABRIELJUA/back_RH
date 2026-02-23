const db = require('../config/db');

const create = async (id_empleado, fecha_inicio, fecha_fin, motivo) => {
  const [result] = await db.query(
    `INSERT INTO vacaciones_solicitudes
     (id_empleado, fecha_inicio, fecha_fin, motivo)
     VALUES (?, ?, ?, ?)`,
    [id_empleado, fecha_inicio, fecha_fin, motivo || null]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`
    SELECT
      v.id,
      v.fecha_inicio,
      v.fecha_fin,
      v.motivo,
      v.creado_en,
      e.num_nomina,
      CONCAT(e.nombre,' ', e.apellido_paterno, ' ', e.apellido_materno) AS empleado
    FROM vacaciones_solicitudes v
    JOIN empleados e ON e.id_empleado = v.id_empleado
    ORDER BY v.creado_en DESC
  `);
  return rows;
};


module.exports = { create, getAll };
