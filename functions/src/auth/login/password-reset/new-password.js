/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../../utils/firebaseAdmin");
const router = express.Router();

router.post("/auth/login/password-reset/new-password", async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).send({
      success: false,
      message: "Email and new password are required.",
    });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    await admin.auth().updateUser(user.uid, {
      password: password,
    });

    return res.status(200).send({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
