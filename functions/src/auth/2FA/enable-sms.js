/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();
const {FieldValue} = require("firebase-admin/firestore");

router.post("/auth/2fa/enable-sms", async (req, res) => {
  const {uid} = req.body;

  if (!uid) {
    return res.status(400).send("Missing uid.");
  }

  try {
    const userDoc = admin.firestore().collection("users").doc(uid);
    const userSnapshot = await userDoc.get();

    if (!userSnapshot.exists) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const userData = userSnapshot.data();

    if (!userData.completePhoneNumber) {
      return res.status(400).send({
        success: false,
        message: "No phone number registered for this user.",
      });
    }

    await userDoc.update({
      is2FASmsEnabled: true,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).send({
      success: true,
      phoneNumber: userData.completePhoneNumber,
      message: "2FA SMS successfully enabled.",
    });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    res.status(500).send({success: false, message: error.message});
  }
});

module.exports = router;
