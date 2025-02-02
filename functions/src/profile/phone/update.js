/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const admin = require("../../utils/firebaseAdmin");

router.post("/profile/phone/update-change", async (req, res) => {
  const {uid, completePhoneNumber} = req.body;

  try {
    const userDoc = admin.firestore().collection("users").doc(uid);
    await userDoc.update({completePhoneNumber});

    res.status(200).json({
      success: true,
      message: "Updated phone number.",
    });
  } catch (error) {
    console.log(error);
    res.status(500)
        .json({success: false, message: "Phone update failed."});
  }
});

module.exports = router;
