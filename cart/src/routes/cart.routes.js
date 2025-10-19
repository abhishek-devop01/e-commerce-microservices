const express = require('express')
const router = express.Router()
const createAuthmiddleware = require('../../middlewares/auth.middleware')
const cartController= require('../controllers/cart.controller')


router.post('/items', createAuthmiddleware(["user"]), cartController.addItemToCart)



module.exports = router