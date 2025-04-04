/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();

router.post("/profile/photos/upload", async (req, res) => {
  const {userId, photos} = req.body;

  if (!userId || !photos) {
    return res.status(400).json({
      success: false,
      error: "User ID and photos are required.",
    });
  }

  try {
    const photoURLs = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (photo && photo.image && photo.fileName && photo.type) {
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
        photoURLs.push(photoURL);
      }
    }

    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.set(
        {photos: photoURLs},
    );

    return res.status(200).json({
      success: true,
      message: "Photos uploaded successfully.",
    });
  } catch (error) {
    console.error("Error uploading photos:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload photos." + error,
    });
  }
});

module.exports = router;
