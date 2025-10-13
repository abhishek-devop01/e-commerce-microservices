const express = require('express');
const multer = require('multer');
const createAuthMiddleware = require('../../middleware/auth.middleware');
const Product = require('../models/product.model');


const router = express.Router();
const upload = multer({
     storage: multer.memoryStorage() })
// Create a new product

router.post('/',createAuthMiddleware(['admin', 'seller']), upload.array('images', 5), productorController.createProduct);

module.exports = router;