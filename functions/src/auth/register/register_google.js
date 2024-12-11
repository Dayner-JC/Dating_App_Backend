/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");

const router = express.Router();

router.post("/auth/register/google", async (req, res) => {
  const {uid, email} = req.body;

  if (!uid || !email) {
    return res.status(400).send({success: false,
      message: "UID and email are required."});
  }

  try {
    const userRef = admin.firestore().collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(200).send({success: true,
        message: "User already registered."});
    }

    await userRef.set({
      email,
      isProfileComplete: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    res.status(201).send({success: true, message:
        "User registered successfully."});
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).send({success: false, message: "Internal server error."});
  }
});

module.exports = router;
