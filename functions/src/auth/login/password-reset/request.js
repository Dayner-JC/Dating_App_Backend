/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../../utils/firebaseAdmin");
const nodemailer = require("nodemailer");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "daynercespedes4@gmail.com",
    pass: "vaoclbdyuotfsyvo",
  },
});

router.post("/auth/login/password-reset/request", async (req, res) => {
  const {email} = req.body;

  if (!email) {
    return res.status(400).send({
      success: false,
      message: "Email is required.",
    });
  }

  try {
    const usersCollection = admin.firestore().collection("users");
    const userSnapshot = await usersCollection
        .where("email", "==", email).get();

    if (userSnapshot.empty) {
      return res.status(404).send({
        success: false,
        message: "There is no user with this email.",
      });
    }

    const userDoc = userSnapshot.docs[0];
    const uid = userDoc.id;

    const verificationCode =
    Math.floor(100000 + Math.random() * 900000).toString();

    await admin.firestore().collection("passwordResetCodes").doc(uid).set({
      code: verificationCode,
    });

    await transporter.sendMail({
      from: "daynercespedes4@gmail.com",
      to: email,
      subject: "Password Recovery",
      text: `Your recovery code is: ${verificationCode}`,
    });

    return res.status(200).send({
      success: true,
      uid: uid,
      message: "Verification code sent to email.",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
