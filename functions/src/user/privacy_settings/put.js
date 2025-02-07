/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();
const {FieldValue} = require("firebase-admin/firestore");

router.post("/user/privacy-settings/put", async (req, res) => {
  const {uid, privacySettings} = req.body;

  if (!uid) {
    return res
        .status(400)
        .send({success: false, message: "User ID is required"});
  }

  if (!privacySettings) {
    return res
        .status(400)
        .send({success: false, message: "Privacy settings are required"});
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res
          .status(404)
          .send({success: false, message: "User not found"});
    }

    await admin.firestore().collection("users").doc(uid).update({
      privacySettings,
      updatedAt: FieldValue.serverTimestamp(),
    });

    res
        .status(200)
        .send({
          success: true,
          message: "Privacy settings updated successfully",
        });
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    res.status(500).send({success: false, message: "An error has occurred"});
  }
});

module.exports = router;
