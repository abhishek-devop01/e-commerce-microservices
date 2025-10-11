const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function authMiddleware(req, res, next) {
     const token = req.cookies.token;

     if(!token){
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
     }

     try{
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = decoded

          req.user = user; // Attach user info to request object
          next();
     } catch(err){
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
     }
}

module.exports = {
     authMiddleware
}