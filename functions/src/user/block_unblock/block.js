/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");
const router = express.Router();

router.post("/user/block_unblock/block", async (req, res) => {
  const {uid, targetUid} = req.body;

  if (!uid || !targetUid) {
    return res
        .status(400)
        .send("Both authenticated user's UID and target UID must be provided.");
  }

  try {
    const userRef = admin.firestore().collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res
          .status(404)
          .send({success: false, message: "User not found."});
    }

    const blockedUsers =
      (userDoc.data() &&
        userDoc.data().privacySettings &&
        userDoc.data().privacySettings.blockedUsers) ||
      {};

    if (blockedUsers[targetUid]) {
      return res
          .status(400)
          .send({success: false, message: "User is already blocked."});
    }

    await userRef.update({
      [`privacySettings.blockedUsers.${targetUid}`]: {
        time: FieldValue.serverTimestamp(),
      },
    });

    res
        .status(200)
        .send({success: true, message: "User blocked successfully."});
  } catch (error) {
    console.error("Error blocking user:", error);
    res
        .status(500)
        .send({
          success: false,
          message: "An error occurred while blocking the user.",
        });
  }
});

module.exports = router;
