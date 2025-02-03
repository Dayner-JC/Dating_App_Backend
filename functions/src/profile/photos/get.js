/* eslint-disable new-cap */
const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();

router.post("/profile/photos/get", async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "User ID is required.",
    });
  }

  try {
    const bucket = admin.storage().bucket();
    const folderPath = `profilePictures/${userId}/`;

    const [files] = await bucket.getFiles({prefix: folderPath});

    const photoURLs = files.map((file) => {
      const emulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST ?
        `http://${process.env.FIREBASE_STORAGE_EMULATOR_HOST}` :
        "https://storage.googleapis.com";

      const filePath = encodeURIComponent(file.name);
      return `${emulatorHost}/v0/b/${file.bucket.name}/o/${filePath}?alt=media`;
    });

    return res.status(200).json({
      success: true,
      images: photoURLs,
    });
  } catch (error) {
    console.error("Error fetching user images:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user images.",
    });
  }
});

module.exports = router;
