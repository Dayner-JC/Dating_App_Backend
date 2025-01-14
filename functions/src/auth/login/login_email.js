/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/auth/login/email", async (req, res) => {
  const {token, uid} = req.body;

  try {
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // const uid = decodedToken.uid;

    const userDoc = await admin.firestore().collection("users")
        .doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404)
          .json({success: false, message: "User not found"});
    }

    const userData = userDoc.data();
    console.log("Login Successful: ", userData);
    res.status(200).json({success: true, user: userData});
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(500)
        .json({success: false, message: "Token verification failed"});
  }
});

module.exports = router;
