/* eslint-disable new-cap */
const express = require("express");
const admin = require("../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");
const mime = require("mime-types");

const router = express.Router();

router.post("/profile/create", async (req, res) => {
  console.log("Request body:", req.body);

  const {uid, name, birthday, gender, preference, height, intentions,
    location, about, interests, photos} = req.body;

  if (!uid || !name || !birthday || !gender || !preference ||
    !height || !intentions || !location || !about || !interests ||
    !photos) {
    return res.status(400).send("All steps data must be provided.");
  }

  try {
    const photoURLs = [];

    if (photos && Array.isArray(photos)) {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (photo) {
          console.log(`Received photo for index ${i}:`, photo);
          const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");

          const mimeType = mime.lookup(photo);
          if (!mimeType) {
            return res.status(400).send("Invalid image format.");
          }

          const fileExtension = mime.extension(mimeType);
          const filePath = `profilePictures/${uid}_${i}.${fileExtension}`;

          const file = admin.storage().bucket().file(filePath);
          await file.save(buffer, {
            contentType: mimeType,
            public: true,
          });

          const emulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST ?
            `http://${process.env.FIREBASE_STORAGE_EMULATOR_HOST}` :
            "https://storage.googleapis.com";
          const photoURL = `${emulatorHost}/v0/b/${file.bucket.name}
          /o/${encodeURIComponent(filePath)}?alt=media`;

          photoURLs.push(photoURL);
        }
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

    res.status(200).send({success: true, uid, photoURLs});
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({success: false, message: error.message});
  }
});

module.exports = router;
