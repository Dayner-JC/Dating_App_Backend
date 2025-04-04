/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");
const {createNotification} = require("../../profile/reactions/notifications");
const router = express.Router();

router.post("/profile/reactions/like", async (req, res) => {
  const {userId, targetUserId} = req.body;

  if (!userId || !targetUserId) {
    return res.status(400).json({success: false, message: "Missing parameters."});
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({success: false, message: "User not found."});
    }

    const userData = userDoc.data();
    const existingLike = userData.reactions && userData.reactions.peopleYouLike && userData.reactions.peopleYouLike[targetUserId];
    const existingDislike = userData.reactions && userData.reactions.peopleYouDislike && userData.reactions.peopleYouDislike[targetUserId];

    if (existingLike) {
      return res.status(400).json({success: false, message: "You have already liked this user."});
    }
    if (existingDislike) {
      return res.status(400).json({success: false, message: "You have already disliked this user. You cannot like them now."});
    }

    const timestamp = FieldValue.serverTimestamp();

    await admin.firestore().collection("users").doc(userId).update({
      [`reactions.peopleYouLike.${targetUserId}`]: {
        time: timestamp,
      },
    });

    await admin.firestore().collection("users").doc(targetUserId).update({
      [`reactions.peopleWhoLikeYou.${userId}`]: {
        time: timestamp,
      },
    });

    const senderProfile = await admin.firestore().collection("users").doc(userId).get();
    const senderData = senderProfile.data();
    const senderName = (senderData && senderData.name) || "Someone";

    const receiverProfile = await admin.firestore().collection("users").doc(targetUserId).get();
    const receiverData = receiverProfile.data();
    const receiverDeviceToken = (receiverData && receiverData.deviceToken) || null;

    const notificationMessage = `${senderName} has liked you.`;
    await createNotification(targetUserId, notificationMessage, "like", receiverDeviceToken);

    return res.status(200).json({success: true, message: "Like registered successfully."});
  } catch (error) {
    console.error("Error registering like:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
});

module.exports = router;
