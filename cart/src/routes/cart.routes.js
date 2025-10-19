const express = require('express')
const router = express.Router()
const createAuthmiddleware = require('../../middlewares/auth.middleware')
const cartController= require('../controllers/cart.controller')
const { validateAddItemToCart } = require('../middlewares/validation.middleware')

router.post('/items',validateAddItemToCart, createAuthmiddleware(["user"]), cartController.addItemToCart)



module.exports = router