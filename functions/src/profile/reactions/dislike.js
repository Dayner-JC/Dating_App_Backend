/* eslint-disable new-cap */
// routes/dislike.js
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");
const router = express.Router();

router.post("/profile/reactions/dislike", async (req, res) => {
  const {userId, targetUserId} = req.body;

  if (!userId || !targetUserId) {
    return res
        .status(400)
        .json({success: false, message: "Missing parameters."});
  }

  try {
    const reactionId = admin.firestore().collection("_").doc().id;

    await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .update({
          [`reactions.dislikes.${reactionId}`]: {
            target: targetUserId,
            time: FieldValue.serverTimestamp(),
          },
        });

    return res
        .status(200)
        .json({success: true, message: "Dislike registered successfully."});
  } catch (error) {
    return res
        .status(500)
        .json({
          success: false,
          message: "An error occurred.",
          error: error.message,
        });
  }
});

module.exports = router;
