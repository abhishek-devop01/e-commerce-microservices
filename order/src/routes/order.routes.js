const express = require("express");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");


const router = express.Router();

router.post('/',authMiddleware(["user"]), )








module.exports = router;
