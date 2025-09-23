const express = require('express')
const authController = require('../controllers/auth.controller')
const validator = require('../middlewares/validator.middleware')

const router = express.Router()

router.post('/register', validator.registerUservalidations, authController.registerUser)


module.exports = router