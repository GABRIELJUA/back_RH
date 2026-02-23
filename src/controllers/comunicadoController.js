const comunicadoModel = require('../models/comunicadoModel');
const multer = require('multer');
const path = require('path');

// ===== MULTER =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/comunicados');
  },
  filename: (req, file, cb) => {
    const name = Date.now() + path.extname(file.originalname);
    cb(null, name);
  }
});

const upload = multer({ storage });

// ================= CREAR =================
const crearComunicado = async (req, res) => {
  try {
    const { titulo, contenido, fecha_publicacion } = req.body;

    if (!titulo || !contenido || !fecha_publicacion) {
      return res.status(400).json({ message: 'Campos obligatorios faltantes' });
    }

    let archivo_url = null;

    if (req.file) {
      archivo_url = `/uploads/comunicados/${req.file.filename}`;
    }

    const id = await comunicadoModel.create({
      titulo,
      contenido,
      archivo_url,
      fecha_publicacion,
      creado_por: req.user.id
    });

    res.status(201).json({
      message: 'Comunicado creado',
      id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear comunicado' });
  }
};

// ================= LISTAR =================
const getComunicados = async (req, res) => {
  try {
    const rows = await comunicadoModel.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comunicados' });
  }
};

// ================= OBTENER 1 =================
const getById = async (req, res) => {
  try {
    const data = await comunicadoModel.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: 'Comunicado no encontrado' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comunicado' });
  }
};

// ================= ACTUALIZAR =================
const updateComunicado = async (req, res) => {
  try {
    const { titulo, contenido, fecha_publicacion } = req.body;
    const id = req.params.id;

    const actual = await comunicadoModel.findById(id);

    if (!actual) {
      return res.status(404).json({ message: 'Comunicado no existe' });
    }

    let archivo_url = actual.archivo_url;

    // si suben nuevo archivo reemplaza
    if (req.file) {
      archivo_url = `/uploads/comunicados/${req.file.filename}`;
    }

    const ok = await comunicadoModel.update(id, {
      titulo,
      contenido,
      archivo_url,
      fecha_publicacion
    });

    if (!ok) {
      return res.status(400).json({ message: 'No se pudo actualizar' });
    }

    res.json({ message: 'Comunicado actualizado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar' });
  }
};

// ================= ELIMINAR =================
const deleteComunicado = async (req, res) => {
  try {
    const ok = await comunicadoModel.remove(req.params.id);

    if (!ok) {
      return res.status(404).json({ message: 'No encontrado' });
    }

    res.json({ message: 'Comunicado eliminado' });

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar' });
  }
};

module.exports = {
  crearComunicado,
  getComunicados,
  getById,
  updateComunicado,
  deleteComunicado,
  upload
};
