const express = require('express');
const multer = require('multer')
const tradeController = require('../controllers/trade.controller')

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/upload', upload.single('file'), tradeController.uploadTrades);
router.post('/balances', tradeController.getBalance);

module.exports = router;