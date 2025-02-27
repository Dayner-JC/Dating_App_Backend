/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");
const router = express.Router();

router.post("/profile/create", async (req, res) => {
  const {uid, name, birthday, gender, preference, height, intentions,
    location, about, interests} = req.body;

  if (!uid || !name || !birthday || !gender || !preference ||
    !height || !intentions || !about || !interests) {
    return res.status(400).send("All steps data must be provided.");
  }

  try {
    await admin.firestore().collection("users").doc(uid).set({
      name,
      birthday,
      gender,
      preference,
      height,
      intentions,
      location,
      about,
      interests,
      datingPreferences: {
        maxDistance: 5,
        ageRange: [18, 30],
        photoRangeIndex: [4, 6],
      },
      reactions: {
        peopleYouLike: {},
        peopleYouDislike: {},
        peopleWhoLikeYou: {},
        peopleWhoDislikeYou: {},
      },
      matches: [],
      privacySettings: {
        profileVisibility: {
          Visible_to_all_users: true,
          Visible_only_to_matches: false,
          Hide_profile_temporarily: false,
        },
        notifications: {
          newMessages: true,
          likesReceived: true,
          matchesSuggestions: true,
          appUpdates: true,
        },
        geolocation: true,
        dataUsage: {
          matchCustomization: true,
          analysisImprovements: true,
          marketingPromotions: true,
          cookiesTracking: true,
        },
        blockedUsers: [],
        reportedUsers: [],
      },
      isProfileComplete: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, {merge: true});

    res.status(200).send({success: true, message: "Profile created successfully"});
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).send({success: false, message: "An error has occurred"});
  }
});

module.exports = router;
