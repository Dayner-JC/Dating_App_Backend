/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");

const router = express.Router();

router.post("/auth/register/phone", async (req, res) => {
  const {phoneNumber} = req.body;

  if (!phoneNumber) {
    return res.status(400).send("Missing phoneNumber.");
  }

  try {
    const userDoc = admin.firestore().collection("users").doc();
    await userDoc.set({
      phoneNumber,
      createdAt: FieldValue.serverTimestamp(),
      isProfileComplete: false,
    });

    res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.error("Error during phone registration:", error);
    res.status(500).send({success: false, message: error.message});
  }
});

module.exports = router;
