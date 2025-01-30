/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const admin = require("../../utils/firebaseAdmin");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "daynercespedes4@gmail.com",
    pass: "vaoclbdyuotfsyvo",
  },
});

router.post("/profile/email/request-change", async (req, res) => {
  const {uid, email} = req.body;

  try {
    const userDoc = await admin.firestore().collection("users")
        .doc(uid).get();

    if (!userDoc.exists) {
      console.log("UID: ", uid);
      return res.status(404)
          .json({success: false, message: "User not found"});
    }

    const verificationCode =
    Math.floor(100000 + Math.random() * 900000).toString();

    await admin.firestore().collection("emailCodesVerify").doc(uid).set({
      code: verificationCode,
    });

    await transporter.sendMail({
      from: "daynercespedes4@gmail.com",
      to: email,
      subject: "Verify your email",
      text: `Your verification code is: ${verificationCode}`,
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent to email.",
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(500)
        .json({success: false, message: "Token verification failed"});
  }
});

module.exports = router;
