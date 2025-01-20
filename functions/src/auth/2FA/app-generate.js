/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();

router.post("/auth/2fa/app-generate", async (req, res) => {
  const {userId} = req.body;

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found."});
    }

    const userData = userDoc.data();

    if (userData.is2FAAppEnabled) {
      return res.status(400).json({error: "2FA is already enabled for this user."});
    }

    const secret = speakeasy.generateSecret({
      name: `DatingApp`,
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    await userRef.update({
      authAppSecret: secret.base32,
    });

    return res.status(200).json({
      message: "2FA setup initiated.",
      qrCodeUrl,
      secret: secret.base32,
    });
  } catch (error) {
    console.error("Error during 2FA setup:", error);
    res.status(500).json({error: "An error occurred while setting up 2FA."});
  }
});

module.exports = router;
