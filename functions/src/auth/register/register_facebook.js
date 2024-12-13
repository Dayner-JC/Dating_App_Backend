/* eslint-disable new-cap */
const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();

router.post("/auth/register/facebook", async (req, res) => {
  try {
    const {idToken, email, phoneNumber} = req.body;

    if (!idToken) {
      return res.status(400).send({success: false, message: "Missing idToken"});
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.set({
      email: email || "",
      phoneNumber: phoneNumber || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});

    res.status(200).send({success: true});
  } catch (error) {
    console.error("Facebook Registration Error:", error);
    res.status(500).send({success: false, message: error.message});
  }
});

module.exports = router;
