/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();
router.post("/profile/edit/edit-about", async (req, res) => {
  const {userId, about} = req.body;

  if (!userId || !about) {
    return res.status(400).json({
      success: false,
      error: "User ID and description are required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({about});

    return res.status(200).json({
      success: true,
      message: "Description updated successfully.",
    });
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update description.",
    });
  }
});

module.exports = router;
