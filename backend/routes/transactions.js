const express = require('express');
const router = express.Router();
const multer = require('multer');
const { upload, list } = require('../controllers/transactionController');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage });

router.post('/upload', auth, uploadMiddleware.single('file'), upload);
router.post('/', auth, require('../controllers/transactionController').create);
router.get('/', auth, list);
router.get('/summary', auth, require('../controllers/transactionController').summary);

module.exports = router; 