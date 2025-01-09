/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();

router.post("/auth/login/phone", async (req, res) => {
  const {firebaseIdToken} = req.body;

  if (!firebaseIdToken) {
    return res.status(400).send({
      success: false,
      message: "firebaseIdToken is missing.",
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const uid = decodedToken.uid;

    const userRef = admin.firestore().collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send({
        success: false,
        message: "User does not exist.",
      });
    }

    const user = userDoc.data();

    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error during phone login:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
