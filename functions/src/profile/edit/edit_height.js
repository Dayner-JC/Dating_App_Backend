/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();

router.post("/profile/edit/edit-height", async (req, res) => {
  const {userId, height} = req.body;

  if (!userId || !height) {
    return res.status(400).json({
      success: false,
      error: "User ID and height are required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({height});

    return res.status(200).json({
      success: true,
      message: "Height updated successfully.",
    });
  } catch (error) {
    console.error("Error updating height:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update height.",
    });
  }
});

module.exports = router;
