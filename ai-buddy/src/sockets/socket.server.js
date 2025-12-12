const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const agent = require("../agent/agent");
const { meta } = require("zod/v4/core");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;

    const { token } = cookies ? cookie.parse(cookies) : {};

    if (!token) {
      return next(new Error("Token error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      socket.token = token;
      next();
    } catch (err) {
      return next(new Error("Invalid Token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(socket.user, socket.token);

    socket.on("message", async (data) => {
      const agentResponse = await agent.invoke(
        {
          message: [
            {
              role: "user",
              content: data.message,
            },
          ],
        },
        {
          metadata: {
            token: socket.token,
          },
        }
      );
      const lastMessage = agentResponse.messages[agentResponse.messages.length - 1];
      socket.emit("message", {
        message: lastMessage.content,
      });
    });
  });
}

module.exports = { initSocketServer };
