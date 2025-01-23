/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();

router.post("/profile/edit/edit-intentions", async (req, res) => {
  const {userId, intentions} = req.body;

  if (!userId || !intentions) {
    return res.status(400).json({
      success: false,
      error: "User ID and intentions are required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({intentions});

    return res.status(200).json({
      success: true,
      message: "Intentions updated successfully.",
    });
  } catch (error) {
    console.error("Error updating intentions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update intentions.",
    });
  }
});

module.exports = router;
