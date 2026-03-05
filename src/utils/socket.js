const socketIO = require("socket.io");
const cryto = require("crypto");
const { Chat } = require("../models/chat");

const createScreateRoomId = (targetUserId, userId) => {
  return cryto
    .createHash("sha256")
    .update([String(targetUserId), String(userId)].sort().join("-"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, targetUserId, userId }) => {
      const roomId = createScreateRoomId(targetUserId, userId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = createScreateRoomId(targetUserId, userId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, text });
        } catch (error) {}
      },
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket };
