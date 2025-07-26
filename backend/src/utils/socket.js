import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["https://your-frontend.com"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`✅ User ${userId} joined`);
    });

    socket.on("disconnect", () => {
      for (const [userId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};

export const emitToUser = (userId, event, payload) => {
  const socketId = onlineUsers.get(userId);
  if (socketId && io) {
    console.log(`📤 Emitting ${event} to ${userId} (${socketId})`);
    io.to(socketId).emit(event, payload);
  } else {
    console.log("⚠️ User not online or socket not initialized", userId);
  }
};
