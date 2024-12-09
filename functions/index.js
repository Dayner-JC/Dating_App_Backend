/* eslint-disable max-len */
const functions = require("firebase-functions");
const express = require("express");
const admin = require("./firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");
const mime = require("mime-types");

const app = express();

app.use(express.json());

app.post("/create-profile", async (req, res) => {
  console.log("Request body:", req.body);
  const {name, email, password, photo} = req.body;

  if (!name || !email || !password || !photo) {
    return res.status(400).send("Name, email, photo and password are required.");
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

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
      const filePath = `profilePictures/${userRecord.uid}.${fileExtension}`;

      const file = admin.storage().bucket().file(filePath);
      await file.save(buffer, {
        contentType: mimeType,
      });

      const emulatorHost = `http://${process.env.FIREBASE_STORAGE_EMULATOR_HOST}`;
      photoURL = `${emulatorHost}/v0/b/${file.bucket.name}/o/
      ${encodeURIComponent(filePath)}?alt=media`;
    }

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      name,
      email,
      photoURL,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(200).send({success: true, uid: userRecord.uid, photoURL});
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({success: false, message: error.message});
  }
});

exports.api = functions.https.onRequest(app);
