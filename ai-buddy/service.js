require('dotenv').config();
const app = require('./src/app');
const http = require('http');
const { initSocketServer } = require('./src/sockets/socket.server');
const connectDB = require('./src/db/db');




const httpServer = http.createServer(app);

initSocketServer(httpServer);


connectDB()
httpServer.listen(3005, () => {
  console.log('Server is listening on port 3005');
});
