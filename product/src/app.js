const express = require('express')
const cookieParser = require('cookie-parser')


const app = express()
app.use(express.json())
app.uss(cookieParser())




module.exports = app