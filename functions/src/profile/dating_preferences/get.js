/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();

router.post("/profile/dating_preferences/get", async (req, res) => {
  const {uid} = req.body;

  if (!uid) {
    return res.status(400).send({success: false, message: "UID is required"});
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).send({success: false, message: "User not found"});
    }

    const userData = userDoc.data();

    res.status(200).send({
      success: true,
      datingPreferences: userData.datingPreferences,
      preference: userData.preference,
    });
  } catch (error) {
    res.status(500).send({success: false, message: "An error has occurred"});
  }
});

module.exports = router;
