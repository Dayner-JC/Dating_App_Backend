/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();

router.post("/user/privacy-settings/get", async (req, res) => {
  const {uid} = req.body;

  if (!uid) {
    return res
        .status(400)
        .send({success: false, message: "User ID is required"});
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res
          .status(404)
          .send({success: false, message: "User not found"});
    }

    const userData = userDoc.data();

    const privacySettings = userData.privacySettings || {
      notifications: {
        newMessages: true,
        likesReceived: true,
        matchesSuggestions: true,
        appUpdates: true,
      },
      geolocation: true,
      dataUsage: {
        matchCustomization: true,
        analysisImprovements: true,
        marketingPromotions: true,
        cookiesTracking: true,
      },
      blockedUsers: [],
      reportedUsers: [],
    };

    res.status(200).send({success: true, privacySettings});
  } catch (error) {
    console.error("Error fetching privacy settings:", error);
    res.status(500).send({success: false, message: "An error has occurred"});
  }
});

module.exports = router;
