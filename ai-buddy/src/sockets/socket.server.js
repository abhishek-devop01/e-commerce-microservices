const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use((socket, next)=>{
     const cookies = socket.handshake.headers.cookie;

     const {token} = cookie ? cookie.parse(cookies) : {};
     
     if(!token){
           return next(new Error("Token error"));
     }

     try{
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          socket.user = decoded;
          next();
     }catch(err){
          return next(new Error("Invalid Token"));
     }
  })

  io.on("connection", (socket) => {
    console.log("New client connected");
  });
}

module.exports = { initSocketServer };
