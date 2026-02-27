const express = require('express');
const router = express.Router();

const {
  createAlbum,
  addPhotosToAlbum,
  getAlbums,
  getAlbumPhotos,
  deletePhoto,
  deleteAlbum
} = require('../controllers/galleryController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const uploadGallery = require('../middlewares/uploadGallery');

router.get('/public/albums', getAlbums);
router.get('/public/albums/:albumId/photos', getAlbumPhotos);

router.get('/albums', verifyToken, getAlbums);
router.get('/albums/:albumId/photos', verifyToken, getAlbumPhotos);

router.post(
  '/albums',
  verifyToken,
  allowRoles('ADMIN', 'ADMIN_EDITOR'),
  uploadGallery.array('fotos', 20),
  createAlbum
);

router.post(
  '/albums/:albumId/photos',
  verifyToken,
  allowRoles('ADMIN', 'ADMIN_EDITOR'),
  uploadGallery.array('fotos', 20),
  addPhotosToAlbum
);

router.delete(
  '/photos/:photoId',
  verifyToken,
  allowRoles('ADMIN', 'ADMIN_EDITOR'),
  deletePhoto
);

router.delete(
  '/albums/:albumId',
  verifyToken,
  allowRoles('ADMIN'),
  deleteAlbum
);

module.exports = router;
