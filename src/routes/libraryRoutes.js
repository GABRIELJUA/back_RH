const express = require('express');
const router = express.Router();

const {
  uploadFile,
  getFiles,
  deleteFile,
  getPublicDocuments
} = require('../controllers/libraryController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadLibrary');


// ================== LISTAR (TODOS) ==================
router.get(
  '/',
  verifyToken,
  getFiles
);

// ================== SUBIR (ADMIN / EDITOR) ==================
router.post(
  '/upload',
  verifyToken,
  allowRoles('ADMIN', 'ADMIN_EDITOR'),
  upload.single('archivo'),
  uploadFile
);

// ================== ELIMINAR (ADMIN) ==================
router.delete(
  '/:id',
  verifyToken,
  allowRoles('ADMIN'),
  deleteFile
);

router.get('/public', getPublicDocuments);


module.exports = router;
