const express = require('express')
const router = express.Router()
const createAuthMiddleware = require('../middlewares/auth.middleware')
const cartController= require('../controllers/cart.controller')
const { validateAddItemToCart, validateUpdateCartItem } = require('../middlewares/validation.middleware')

router.get('/cart',
    createAuthMiddleware([ 'user' ]),
    cartController.getCart
);

router.post('/items',
     validateAddItemToCart,
     createAuthMiddleware(["user"]),
     cartController.addItemToCart
);
router.patch(
    '/items/:productId',
    validateUpdateCartItem,
    createAuthMiddleware([ 'user' ]),
    cartController.updateItemQuantity
);


module.exports = router