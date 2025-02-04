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
    const usersSnapshot = await admin.firestore().collection("users").get();

    const users = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== uid);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({error: "Failed to fetch users"});
  }
});

module.exports = router;
