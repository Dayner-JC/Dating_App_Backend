/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");

const router = express.Router();

router.post("/profile/create", async (req, res) => {
  const {uid, name, birthday, gender, preference, height, intentions,
    location, about, interests, photos} = req.body;

  if (!uid || !name || !birthday || !gender || !preference ||
    !height || !intentions || !about || !interests ||
    !photos || !Array.isArray(photos)) {
    return res.status(400).send("All steps data must be provided.");
  }

  try {
    const photoURLs = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (photo && photo.image && photo.fileName && photo.type) {
        const base64Data = photo.image;
        const buffer = Buffer.from(base64Data, "base64");

        const filePath = `profilePictures/${uid}_${Date.now()}_${photo.fileName}`;
        const file = admin.storage().bucket().file(filePath);

        await file.save(buffer, {
          metadata: {contentType: photo.type},
          public: true,
        });

        const emulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST ?
          `http://${process.env.FIREBASE_STORAGE_EMULATOR_HOST}` :
          "https://storage.googleapis.com";

        const photoURL = `${emulatorHost}/v0/b/${file.bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
        photoURLs.push(photoURL);
      }
    }

    await admin.firestore().collection("users").doc(uid).set({
      name,
      birthday,
      gender,
      preference,
      height,
      intentions,
      location,
      about,
      interests,
      photos: photoURLs,
      isProfileComplete: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, {merge: true});

    res.status(200).send({success: true, message: "Success"});
  } catch (error) {
    res.status(500).send({success: false, message: "An error has occurred"});
  }
});

module.exports = router;
