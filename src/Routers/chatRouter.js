const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middleware/auth");
const { Chat } = require("../models/chat"); // ✅ correct destructuring

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user?._id;

  // ✅ ObjectId validation
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return res.status(400).json({ message: "Invalid target user ID" });
  }

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate("messages.senderId", "firstName lastName");

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });

      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("CHAT FETCH ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = chatRouter;
