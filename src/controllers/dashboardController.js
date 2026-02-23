const dashboardModel = require('../models/dashboardModel');

const getSummary = async (req, res) => {
  try {
    const summary = await dashboardModel.getSummary();

    res.json({
      empleados: summary.total_empleados,
      sugerencias: summary.total_sugerencias,
      comunicados: summary.total_comunicados,
      vacaciones: summary.total_vacaciones
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener resumen del dashboard' });
  }
};

const getDistribucion = async (req, res) => {
  try {
    const distribucion = await dashboardModel.getDistribucionDepartamentos();
    res.json(distribucion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener distribución por departamento' });
  }
};


module.exports = {
  getSummary,
  getDistribucion
};
