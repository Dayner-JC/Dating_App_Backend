/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();
const {FieldValue} = require("firebase-admin/firestore");

router.post("/profile/dating_preferences/update", async (req, res) => {
  const {uid, datingPreferences} = req.body;

  if (!uid || !datingPreferences) {
    return res.status(400).send("All fields must be provided.");
  }

  try {
    const userRef = admin.firestore().collection("users").doc(uid);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res
          .status(404)
          .send({success: false, message: "User not found"});
    }

    await userRef.update({
      datingPreferences,
      updatedAt: FieldValue.serverTimestamp(),
    });

    res
        .status(200)
        .send({success: true, message: "Preferences updated successfully"});
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).send({success: false, message: "An error has occurred"});
  }
});

module.exports = router;
