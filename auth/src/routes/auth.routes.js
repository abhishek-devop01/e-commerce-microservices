const express = require('express')
const authController = require('../controllers/auth.controller')
const validator = require('../middlewares/validator.middleware')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/register', validator.registerUservalidations, authController.registerUser)
router.post('/login', validator.loginUserValidation, authController.loginUser)

router.get('/me',authMiddleware.authMiddleware, authController.getCurrentUser)
router.get('/logout', authController.logoutUser)

router.get('/users/me/addresses', authMiddleware.authMiddleware, authController.getUserAddresses)
router.post('/users/me/addresses', authMiddleware.authMiddleware, validator.addUserAddressValidation, authController.addUserAddress)

module.exports = router