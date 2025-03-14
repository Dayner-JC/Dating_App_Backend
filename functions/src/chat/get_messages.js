/* eslint-disable new-cap */
const express = require("express");
const admin = require("../utils/firebaseAdmin");
const router = express.Router();
const firestore = admin.firestore();

router.post("/chat/get-messages", async (req, res) => {
  const {user1, user2, lastTimestamp} = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({success: false, error: "Data is missing"});
  }

  try {
    const chatId = [user1, user2].sort().join("_");
    let messagesRef = firestore
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy("timestamp", "asc");

    if (lastTimestamp) {
      messagesRef = messagesRef.startAfter(lastTimestamp);
    }

    const snapshot = await messagesRef.get();
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({success: true, messages});
  } catch (error) {
    console.error("Error getting messages:", error);
    res
        .status(500)
        .json({success: false, error: "Messages could not be obtained"});
  }
});

module.exports = router;
