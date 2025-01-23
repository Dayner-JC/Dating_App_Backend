/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../utils/firebaseAdmin");

const router = express.Router();

router.post("/profile/request-data", async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "User ID is required.",
    });
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    const userData = userDoc.data();

    return res.status(200).json({
      success: true,
      name: userData.name || "",
      description: userData.about || "",
      interests: userData.interests || "",
      birthday: userData.birthday || "",
      height: userData.height || "",
      gender: userData.gender || "",
      preference: userData.preference || "",
      intentions: userData.intentions || "",
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user data.",
    });
  }
});

module.exports = router;
