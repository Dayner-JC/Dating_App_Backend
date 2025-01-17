/* eslint-disable new-cap */
const express = require("express");
const speakeasy = require("speakeasy");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();

router.post("/auth/2fa/app-verify", async (req, res) => {
  const {userId, token} = req.body;

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found."});
    }

    const userData = userDoc.data();

    if (!userData.authAppSecret) {
      return res.status(400).json({error: "2FA is not set up for this user."});
    }

    const isVerified = speakeasy.totp.verify({
      secret: userData.authAppSecret,
      encoding: "base32",
      token,
    });

    if (!isVerified) {
      return res.status(400).json({error: "Invalid 2FA code."});
    }

    if (!userData.is2FAEnabled) {
      await userRef.update({is2FAEnabled: true});
    }

    return res.status(200).json({message: "2FA verified successfully."});
  } catch (error) {
    console.error("Error during 2FA verification:", error);
    res.status(500).json({error: "An error occurred while verifying 2FA."});
  }
});


module.exports = router;
