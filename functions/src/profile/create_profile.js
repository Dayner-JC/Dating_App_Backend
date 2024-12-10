/* eslint-disable new-cap */
const express = require("express");
const admin = require("../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");
const mime = require("mime-types");

const router = express.Router();

router.post("/auth/profile/create", async (req, res) => {
  console.log("Request body:", req.body);
  const {uid, name, email, password, photo} = req.body;

  if (!uid || !name || !email || !password || !photo) {
    return res.status(400).send("Name, email, and password are required.");
  }

  try {
    let photoURL = null;

    if (photo) {
      console.log("Received photo (Base64):", photo);
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const mimeType = mime.lookup(photo);
      if (!mimeType) {
        return res.status(400).send("Invalid image format.");
      }

      const fileExtension = mime.extension(mimeType);
      const filePath = `profilePictures/${uid}.${fileExtension}`;

      const file = admin.storage().bucket().file(filePath);
      await file.save(buffer, {
        contentType: mimeType,
      });

      const emulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST ?
        `http://${process.env.FIREBASE_STORAGE_EMULATOR_HOST}` :
        "https://storage.googleapis.com";
      photoURL = `${emulatorHost}/v0/b/${file.bucket.name}/o/
      ${encodeURIComponent(filePath)}?alt=media`;
    }

    await admin.firestore().collection("users").doc(uid).set({
      name,
      email,
      photoURL,
      isProfileComplete: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, {merge: true});

    res.status(200).send({success: true, uid, photoURL});
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({success: false, message: error.message});
  }
});

module.exports = router;
