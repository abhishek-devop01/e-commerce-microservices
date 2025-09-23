const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());



// Register route
app.use('/api/auth', require('./routes/auth.routes'));


module.exports = app;
