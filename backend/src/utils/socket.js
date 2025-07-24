import { Server } from "socket.io";

let io;

const onlineUser = new Map();
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);
  });
};
