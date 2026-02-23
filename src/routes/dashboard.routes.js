const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middlewares/authMiddleware');


router.get('/summary', verifyToken, dashboardController.getSummary);
router.get('/distribucion', verifyToken, dashboardController.getDistribucion);


module.exports = router;
