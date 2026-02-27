const fs = require('fs');
const path = require('path');

const galleryModel = require('../models/galleryModel');
const auditLogModel = require('../models/auditLogModel');
const { getPagination } = require('../utils/pagination');

const toPhotoPayload = (files = [], userId) => {
  return files.map((file, index) => ({
    archivo_url: `/uploads/galeria/${file.filename}`,
    orden: index,
    subido_por: userId
  }));
};

const deleteFileIfExists = (fileUrl) => {
  const relativePath = fileUrl.replace(/^\/+/, '');
  const fullPath = path.resolve(process.cwd(), relativePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

const createAlbum = async (req, res) => {
  try {
    const { nombre, descripcion, anio } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del álbum es obligatorio' });
    }

    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'Debes subir al menos una foto' });
    }

    const coverUrl = `/uploads/galeria/${req.files[0].filename}`;

    const albumId = await galleryModel.createAlbum({
      nombre,
      descripcion,
      anio,
      portada_url: coverUrl,
      creado_por: req.user.id
    });

    const photosPayload = toPhotoPayload(req.files, req.user.id);
    await galleryModel.addPhotos(albumId, photosPayload);

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'CREATE',
      entity: 'GALERIA_ALBUM',
      entity_id: albumId,
      details: { nombre, total_fotos: req.files.length }
    });

    res.status(201).json({
      message: 'Álbum creado correctamente',
      id: albumId
    });
  } catch (error) {
    console.error('Error creando álbum:', error);
    res.status(500).json({ message: 'Error al crear álbum' });
  }
};

const addPhotosToAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await galleryModel.findAlbumById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Álbum no encontrado' });
    }

    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No se enviaron fotos' });
    }

    const photosPayload = toPhotoPayload(req.files, req.user.id);
    await galleryModel.addPhotos(albumId, photosPayload);

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'CREATE',
      entity: 'GALERIA_FOTOS',
      entity_id: Number(albumId),
      details: { album_id: Number(albumId), total_fotos: req.files.length }
    });

    res.status(201).json({ message: 'Fotos agregadas correctamente' });
  } catch (error) {
    console.error('Error agregando fotos:', error);
    res.status(500).json({ message: 'Error al agregar fotos al álbum' });
  }
};

const getAlbums = async (req, res) => {
  try {
    const filters = {
      anio: req.query.anio,
      q: req.query.q
    };

    const pagination = getPagination(req.query);
    const albums = await galleryModel.getAlbums(filters, pagination);

    res.json(albums);
  } catch (error) {
    console.error('Error obteniendo álbumes:', error);
    res.status(500).json({ message: 'Error al obtener álbumes' });
  }
};

const getAlbumPhotos = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await galleryModel.findAlbumById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Álbum no encontrado' });
    }

    const photos = await galleryModel.getPhotosByAlbum(albumId);

    res.json({
      album,
      fotos: photos
    });
  } catch (error) {
    console.error('Error obteniendo fotos:', error);
    res.status(500).json({ message: 'Error al obtener fotos del álbum' });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await galleryModel.findPhotoById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }

    deleteFileIfExists(photo.archivo_url);
    await galleryModel.removePhoto(photoId);

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'DELETE',
      entity: 'GALERIA_FOTO',
      entity_id: Number(photoId),
      details: { album_id: photo.album_id, archivo_url: photo.archivo_url }
    });

    res.json({ message: 'Foto eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando foto:', error);
    res.status(500).json({ message: 'Error al eliminar foto' });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await galleryModel.findAlbumById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Álbum no encontrado' });
    }

    const photos = await galleryModel.getPhotosByAlbum(albumId);
    photos.forEach((photo) => {
      deleteFileIfExists(photo.archivo_url);
    });

    await galleryModel.removeAlbum(albumId);

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'DELETE',
      entity: 'GALERIA_ALBUM',
      entity_id: Number(albumId),
      details: { nombre: album.nombre, total_fotos: photos.length }
    });

    res.json({ message: 'Álbum eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando álbum:', error);
    res.status(500).json({ message: 'Error al eliminar álbum' });
  }
};

module.exports = {
  createAlbum,
  addPhotosToAlbum,
  getAlbums,
  getAlbumPhotos,
  deletePhoto,
  deleteAlbum
};
