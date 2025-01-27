/* eslint-disable new-cap */
const express = require("express");
const admin = require("../utils/firebaseAdmin");

const router = express.Router();

router.post("/user/delete", async (req, res) => {
  const {uid} = req.body;

  if (!uid) {
    return res.status(400).send("User UID must be provided.");
  }

  try {
    await admin.firestore().collection("users").doc(uid).delete();

    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({
      prefix: `profilePictures/${uid}/`,
    });

    const deletePromises = files.map((file) => file.delete());
    await Promise.all(deletePromises);

    res
        .status(200)
        .send({success: true, message: "User deleted successfully"});
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred during deletion",
    });
  }
});

module.exports = router;
