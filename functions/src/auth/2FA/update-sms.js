/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();
const {FieldValue} = require("firebase-admin/firestore");

router.post("/auth/2fa/update-sms", async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    return res.status(400).send("Missing uid.");
  }

  try {
    const userDoc = admin.firestore().collection("users").doc(userId);
    const userSnapshot = await userDoc.get();

    const userData = userSnapshot.data();

    if (!userData.is2FASmsEnabled) {
      await userDoc.update({
        is2FASmsEnabled: true,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return res.status(200).send({
      success: true,
      message: "2FA SMS successfully enabled.",
    });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    res.status(500).send({success: false, message: error.message});
  }
});

module.exports = router;
