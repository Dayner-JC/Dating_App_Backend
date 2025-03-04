/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const admin = require("../utils/firebaseAdmin");

router.post("/get_users/get", async (req, res) => {
  const {uid} = req.body;

  if (!uid) {
    return res.status(400).send("User UID must be provided.");
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found."});
    }

    const userData = userDoc.data();
    const userPreference = userData.preference;

    if (!userPreference) {
      return res.status(400).json({error: "User preference not found."});
    }

    const usersSnapshot = await admin.firestore().collection("users").get();

    let filteredUsers = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== uid);

    if (userPreference !== "everyone") {
      filteredUsers = filteredUsers.filter(
          (user) => user.preference !== userPreference,
      );
    }

    filteredUsers = filteredUsers.slice(0, 10);

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({error: "Failed to fetch users"});
  }
});

module.exports = router;
