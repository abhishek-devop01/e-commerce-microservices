const express = require('express');
const multer = require('multer');
const productController = require('../controllers/product.controller');
const createAuthMiddleware = require('../middlewares/auth.middleware');
const { createProductValidators } = require('../validators/product.validators');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/products
router.post(
    '/',
    createAuthMiddleware([ 'user', 'seller' ]),
    upload.array('images', 5),
    createProductValidators,
    productController.createProduct
);

// GET /api/products
router.get('/', productController.getProducts);

// GET /api/products/seller
router.get('/seller', createAuthMiddleware(['seller']), productController.getSellerProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// DELETE /api/products/:id
router.delete('/:id', createAuthMiddleware(['seller']), productController.deleteProduct);

// PATCH /api/products/:id
router.patch('/:id', createAuthMiddleware(['seller']), productController.updateProduct);

module.exports = router;