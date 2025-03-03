/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const admin = require("../utils/firebaseAdmin");

router.post("/get_users/get-suggestions", async (req, res) => {
  const {userId} = req.body;
  if (!userId) {
    return res.status(400).json({error: "User ID must be provided."});
  }

  try {
    const usersSnapshot = await admin.firestore().collection("users").get();

    let suggestions = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== userId);

    suggestions = suggestions.sort(() => Math.random() - 0.5).slice(0, 10);
    console.log(JSON.stringify(suggestions, null, 2));

    res.status(200).json({success: true, data: suggestions});
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({error: "Failed to fetch suggestions"});
  }
});

module.exports = router;
