/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();
router.post("/profile/edit/edit-location", async (req, res) => {
  const {userId, location} = req.body;

  if (!userId || !location) {
    return res.status(400).json({
      success: false,
      error: "User ID and location are required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({location});

    return res.status(200).json({
      success: true,
      message: "Location updated successfully.",
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update location.",
    });
  }
});

module.exports = router;
