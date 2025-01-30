/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const admin = require("../../utils/firebaseAdmin");

router.post("/profile/email/update-change", async (req, res) => {
  const {uid, email} = req.body;

  try {
    const userDoc = admin.firestore().collection("users").doc(uid);
    await userDoc.update({email});

    res.status(200).json({
      success: true,
      message: "Updated email.",
    });
  } catch (error) {
    console.log(error);
    res.status(500)
        .json({success: false, message: "Email update failed."});
  }
});

module.exports = router;
