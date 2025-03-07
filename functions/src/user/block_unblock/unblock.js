/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");
const router = express.Router();

router.post("/user/block_unblock/unblock", async (req, res) => {
  const {uid, targetUid} = req.body;

  if (!uid || !targetUid) {
    return res
        .status(400)
        .send("Both authenticated user's UID and target UID must be provided.");
  }

  try {
    await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          [`privacySettings.blockedUsers.${targetUid}`]: FieldValue.delete(),
        });

    res
        .status(200)
        .send({success: true, message: "User unblocked successfully."});
  } catch (error) {
    console.error("Error unblocking user:", error);
    res
        .status(500)
        .send({
          success: false,
          message: "An error occurred while unblocking the user.",
        });
  }
});

module.exports = router;
