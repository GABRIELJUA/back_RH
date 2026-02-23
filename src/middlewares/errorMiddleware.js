const multer = require('multer');

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Ruta no encontrada'
  });
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Archivo demasiado grande. Máximo 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err && err.message === 'Tipo de archivo no permitido') {
    return res.status(400).json({ message: err.message });
  }

  console.error('Error no controlado:', err);
  return res.status(500).json({ message: 'Error interno del servidor' });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
