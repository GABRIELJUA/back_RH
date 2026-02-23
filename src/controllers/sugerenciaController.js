const sugerenciaModel = require('../models/sugerenciaModel');

const createSugerencia = async (req, res) => {
  try {
    const { comentario } = req.body;

    if (!comentario) {
      return res.status(400).json({
        message: 'El comentario es obligatorio'
      });
    }

    const imagen = req.file
      ? `/uploads/sugerencias/${req.file.filename}`
      : null;

    await sugerenciaModel.create(comentario, imagen);

    res.status(201).json({
      message: 'Sugerencia enviada correctamente'
    });

  } catch (error) {
    console.error('Error al guardar sugerencia:', error);
    res.status(500).json({
      message: 'Error al enviar la sugerencia'
    });
  }
};

const getSugerencias = async (req, res) => {
  try {
    const sugerencias = await sugerenciaModel.getAll();
    res.json(sugerencias);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener sugerencias'
    });
  }
};

module.exports = { createSugerencia, getSugerencias };
