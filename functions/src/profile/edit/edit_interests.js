/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");

const router = express.Router();

router.post("/profile/edit/edit-interests", async (req, res) => {
  const {userId, interests} = req.body;

  if (!userId || !Array.isArray(interests)) {
    return res.status(400).json({
      success: false,
      error: "User ID and interests array are required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({interests});

    return res.status(200).json({
      success: true,
      message: "Interests updated successfully.",
    });
  } catch (error) {
    console.error("Error updating interests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update interests.",
    });
  }
});

module.exports = router;
