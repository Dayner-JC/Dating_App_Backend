/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();

router.post("/profile/edit/edit-name", async (req, res) => {
  const {userId, name} = req.body;

  if (!userId || !name) {
    return res.status(400).json({
      success: false,
      error: "User ID and name are required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({name});

    return res.status(200).json({
      success: true,
      message: "Name updated successfully.",
    });
  } catch (error) {
    console.error("Error updating name:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update name.",
    });
  }
});

module.exports = router;
