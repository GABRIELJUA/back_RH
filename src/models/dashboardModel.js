const db = require('../config/db');

const getSummary = async () => {
  const [rows] = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM empleados)   AS total_empleados,
      (SELECT COUNT(*) FROM sugerencias) AS total_sugerencias,
      (SELECT COUNT(*) FROM comunicados) AS total_comunicados,
      (SELECT COUNT(*) FROM vacaciones_solicitudes) AS total_vacaciones
  `);

  return rows[0];
};

const getDistribucionDepartamentos = async () => {
  const [rows] = await db.query(`
    SELECT departamento, COUNT(*) as total
    FROM empleados
    GROUP BY departamento
    ORDER BY total DESC
  `);

  return rows;
};


module.exports = {
  getSummary,
  getDistribucionDepartamentos
};
