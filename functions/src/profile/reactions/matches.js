/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();

router.post("/profile/reactions/matches", async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    return res.status(400).json({success: false, message: "Missing userId parameter."});
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({success: false, message: "User not found."});
    }

    const userData = userDoc.data();
    const matchIds = userData.matches || [];

    const matches = [];
    for (const uid of matchIds) {
      const matchUserDoc = await admin.firestore().collection("users").doc(uid).get();
      if (matchUserDoc.exists) {
        const matchUserData = matchUserDoc.data();
        matches.push({
          ...matchUserData,
          uid,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Matches retrieved successfully.",
      data: matches,
    });
  } catch (error) {
    console.error("Error retrieving matches:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
});

module.exports = router;
