/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../../utils/firebaseAdmin");
const router = express.Router();

router.post("/auth/login/email-verify/verify", async (req, res) => {
  const {uid, code} = req.body;

  if (!uid || !code) {
    return res.status(400).send({
      success: false,
      message: "UID and code are required. ",
    });
  }

  try {
    const doc = await admin.firestore()
        .collection("emailCodesVerify").doc(uid).get();

    if (!doc.exists || doc.data().code !== code) {
      return res.status(400).send({
        success: false,
        message: doc.data().code + " " + code,
      });
    }

    try {
      await admin.firestore()
          .collection("emailCodesVerify").doc(uid).delete();
    } catch (deleteError) {
      return res.status(500).send({
        success: false,
        message: "Error deleting the code.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Code verified.",
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
