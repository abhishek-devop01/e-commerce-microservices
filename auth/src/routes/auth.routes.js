const express = require('express')
const authController = require('../controllers/auth.controller')
const validator = require('../middlewares/validator.middleware')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/register', validator.registerUservalidations, authController.registerUser)
router.post('/login', validator.loginUserValidation, authController.loginUser)

router.get('/me',authMiddleware.authMiddleware, authController.getCurrentUser)


module.exports = router