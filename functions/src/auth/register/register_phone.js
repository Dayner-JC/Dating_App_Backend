/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");

const router = express.Router();

router.post("/auth/register/phone", async (req, res) => {
  const {completePhoneNumber, email, uid} = req.body;

  if (!completePhoneNumber) {
    return res.status(400).send("Missing phoneNumber.");
  }

  try {
    const userRef = admin.firestore().collection("users")
        .where("phoneNumber", "==", completePhoneNumber);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.empty) {
      return res.status(400).send({
        success: false,
        message: "User already registered with this phone number.",
      });
    }

    const userDoc = admin.firestore().collection("users").doc(uid);

    const userData = {
      completePhoneNumber,
      email,
      createdAt: FieldValue.serverTimestamp(),
      isProfileComplete: false,
    };

    await userDoc.set(userData);

    res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.error("Error during phone registration:", error);
    res.status(500).send({success: false, message: error.message});
  }
});

module.exports = router;
