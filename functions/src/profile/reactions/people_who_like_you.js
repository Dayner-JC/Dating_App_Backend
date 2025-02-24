/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();

router.get("/profile/reactions/people-who-like-you", async (req, res) => {
  const {userId} = req.query;

  if (!userId) {
    return res.status(400).json({success: false, message: "Missing userId parameter."});
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({success: false, message: "User not found."});
    }

    const userData = userDoc.data();
    const peopleWhoLikeYou = (userData.reactions && userData.reactions.peopleWhoLikeYou) || {};

    const likedUserIds = Object.keys(peopleWhoLikeYou);

    const likedUsers = [];
    for (const uid of likedUserIds) {
      const likedUserDoc = await admin.firestore().collection("users").doc(uid).get();
      if (likedUserDoc.exists) {
        const likedUserData = likedUserDoc.data();
        likedUsers.push({
          ...likedUserData,
          uid,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "People who like you retrieved successfully.",
      data: likedUsers,
    });
  } catch (error) {
    console.error("Error retrieving people who like you:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
});

module.exports = router;
