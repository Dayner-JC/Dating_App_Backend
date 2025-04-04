/* eslint-disable new-cap */
const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

router.post("/profile/photos/get", async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "User ID is required.",
    });
  }

  try {
    const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    const userData = userDoc.data();
    const photos = userData.photos || [];

    return res.status(200).json({
      success: true,
      images: photos,
    });
  } catch (error) {
    console.error("Error fetching user photos:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user photos.",
    });
  }
});

module.exports = router;
