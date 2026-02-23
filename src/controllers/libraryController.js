const libraryModel = require('../models/libraryModel');
const auditLogModel = require('../models/auditLogModel');
const { getPagination } = require('../utils/pagination');
const path = require('path');
const fs = require('fs');

// ================== SUBIR ARCHIVO ==================
const uploadFile = async (req, res) => {
  try {
    const { titulo, descripcion, categoria } = req.body;

    if (!titulo) {
      return res.status(400).json({ message: 'Título requerido' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Archivo requerido' });
    }

    const archivo_url = `/uploads/biblioteca/${req.file.filename}`;

    const documentId = await libraryModel.create({
      titulo,
      descripcion,
      categoria,
      archivo_url,
      subido_por: req.user.id
    });

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'CREATE',
      entity: 'BIBLIOTECA',
      entity_id: documentId,
      details: { titulo, categoria }
    });

    res.json({ message: 'Archivo subido correctamente' });

  } catch (error) {
    console.error('Error subir archivo:', error);
    res.status(500).json({ message: 'Error al subir archivo' });
  }
};

// ================== LISTAR ==================
const getFiles = async (req, res) => {
  try {
    const filters = {
      categoria: req.query.categoria,
      q: req.query.q
    };

    const pagination = getPagination(req.query);
    const files = await libraryModel.getAll(filters, pagination);
    res.json(files);
  } catch (error) {
    console.error('Error listar archivos:', error);
    res.status(500).json({ message: 'Error al obtener archivos' });
  }
};

// ================== ELIMINAR ==================
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await libraryModel.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    const relativePath = file.archivo_url.replace(/^\/+/, '');
    const filePath = path.resolve(process.cwd(), relativePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await libraryModel.remove(id);

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'DELETE',
      entity: 'BIBLIOTECA',
      entity_id: id,
      details: { archivo_url: file.archivo_url, titulo: file.titulo }
    });

    res.json({ message: 'Archivo eliminado correctamente' });

  } catch (error) {
    console.error('Error eliminar archivo:', error);
    res.status(500).json({ message: 'Error al eliminar archivo' });
  }
};

const getPublicDocuments = async (req, res) => {
  try {
    const docs = await libraryModel.getPublic();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile,
  getPublicDocuments
};
