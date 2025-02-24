const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const { FieldValue } = require("firebase-admin/firestore");
const { createNotification } = require("../../profile/reactions/notifications");
const router = express.Router();

router.post("/profile/reactions/like", async (req, res) => {
  const { userId, targetUserId } = req.body;


  if (!userId || !targetUserId) {
    return res.status(400).json({ success: false, message: "Missing parameters." });
  }

  try {

    const reactionId = admin.firestore().collection("_").doc().id;


    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        [`reactions.likes.${reactionId}`]: {
          target: targetUserId,
          time: FieldValue.serverTimestamp(),
        },
      });

    const senderProfile = await admin.firestore().collection("users").doc(userId).get();
    const senderName = senderProfile.data()?.name || "Alguien";


    const receiverProfile = await admin.firestore().collection("users").doc(targetUserId).get();
    const receiverDeviceToken = receiverProfile.data()?.deviceToken;


    const notificationMessage = `${senderName} te ha dado like.`;
    await createNotification(targetUserId, notificationMessage, "like", receiverDeviceToken);


    return res.status(200).json({ success: true, message: "Like registered successfully." });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
});

module.exports = router;