/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const admin = require("../../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");

router.post("/profile/reactions/dislike", async (req, res) => {
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

    if (existingDislike) {
      return res.status(400).json({success: false, message: "You have already disliked this user."});
    }

    if (existingLike) {
      return res.status(400).json({success: false, message: "You have already liked this user. You cannot dislike them now."});
    }

    const timestamp = FieldValue.serverTimestamp();

    await admin.firestore().collection("users").doc(userId).update({
      [`reactions.peopleYouDislike.${targetUserId}`]: {
        time: timestamp,
      },
    });

    await admin.firestore().collection("users").doc(targetUserId).update({
      [`reactions.peopleWhoDislikeYou.${userId}`]: {
        time: timestamp,
      },
    });

    return res.status(200).json({success: true, message: "Dislike registered successfully."});
  } catch (error) {
    console.error("Error registering dislike:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
});

module.exports = router;
