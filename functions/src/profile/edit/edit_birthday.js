/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();

router.post("/profile/edit/edit-birthday", async (req, res) => {
  const {userId, birthday} = req.body;

  if (!userId || !birthday) {
    return res.status(400).json({
      success: false,
      error: "User ID and birthday are required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({birthday});

    return res.status(200).json({
      success: true,
      message: "Birthday updated successfully.",
    });
  } catch (error) {
    console.error("Error updating birthday:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update birthday.",
    });
  }
});

module.exports = router;
