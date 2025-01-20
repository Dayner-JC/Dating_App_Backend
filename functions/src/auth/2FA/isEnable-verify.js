/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();

router.post("/auth/2fa/isEnable-verify", async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "User ID is required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    const userData = userDoc.data();

    const is2FAAppEnabled = userData.is2FAAppEnabled === true;
    const is2FASmsEnabled = userData.is2FASmsEnabled === true;
    const phoneNumber = userData.completePhoneNumber || null;

    if (!is2FAAppEnabled && !is2FASmsEnabled) {
      return res.status(200).json({
        success: true,
        message: "2FA is not enabled for this user.",
        methods: {
          app: false,
          sms: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "2FA is enabled.",
      methods: {
        app: is2FAAppEnabled,
        sms: is2FASmsEnabled,
      },
      phoneNumber: is2FASmsEnabled ? phoneNumber : null,
    });
  } catch (error) {
    console.error("Error verifying 2FA status:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while verifying 2FA.",
    });
  }
});

module.exports = router;
