/* eslint-disable new-cap */
const express = require("express");
const admin = require("../utils/firebaseAdmin");
const router = express.Router();
const firestore = admin.firestore();

router.post("/chat/send-message", async (req, res) => {
  const {sender, receiver, content} = req.body;

  if (!sender || !receiver || !content) {
    return res.status(400).json({success: false, error: "Data is missing"});
  }

  try {
    const chatId = [sender, receiver].sort().join("_");

    const messagesRef = firestore
        .collection("chats")
        .doc(chatId)
        .collection("messages");

    const newMessage = {
      sender,
      receiver,
      content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await messagesRef.add(newMessage);

    return res.status(200).json({success: true, message: "Message sent"});
  } catch (error) {
    console.error("Error sending message:", error);
    res
        .status(500)
        .json({success: false, error: "Message could not be sent"});
  }
});

module.exports = router;
