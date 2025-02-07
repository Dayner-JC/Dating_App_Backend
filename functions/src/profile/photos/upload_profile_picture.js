/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();

router.post("/profile/photos/upload-profile-picture", async (req, res) => {
  const {userId, photo} = req.body;

  if (!userId || !photo) {
    return res.status(400).json({
      success: false,
      error: "User ID and photo are required.",
    });
  }

  try {
    if (!photo.image || !photo.fileName || !photo.type) {
      return res.status(400).json({
        success: false,
        error: "Invalid photo data.",
      });
    }

    const base64Data = photo.image;
    const buffer = Buffer.from(base64Data, "base64");
    const filePath = `profilePictures/${userId}/${userId}_${Date.now()}_${photo.fileName}`;
    const file = admin.storage().bucket().file(filePath);

    await file.save(buffer, {
      metadata: {contentType: photo.type},
    });

    const emulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST ?
      `http://10.0.2.2:9199` :
      "https://storage.googleapis.com";
    const photoURL = `${emulatorHost}/v0/b/${file.bucket.name}/o/${encodeURIComponent(
        filePath,
    )}?alt=media`;

    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    const userData = userDoc.data();
    const currentPhotos = userData.photos || [];
    currentPhotos[0] = photoURL;

    await userRef.update({photos: currentPhotos});

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      photoURL,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload profile picture.",
    });
  }
});

module.exports = router;
