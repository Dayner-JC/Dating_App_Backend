/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();

router.post("/profile/edit/edit-preference", async (req, res) => {
  const {userId, preference} = req.body;

  if (!userId || !preference) {
    return res.status(400).json({
      success: false,
      error: "User ID and preference are required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({preference});

    return res.status(200).json({
      success: true,
      message: "Preference updated successfully.",
    });
  } catch (error) {
    console.error("Error updating preference:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update preference.",
    });
  }
});

module.exports = router;
