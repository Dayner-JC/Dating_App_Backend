/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const router = express.Router();

router.post("/user/block_unblock/get", async (req, res) => {
  const {uid} = req.body;

  if (!uid) {
    return res.status(400).send("Authenticated user's UID must be provided.");
  }

  try {
    const userRef = admin.firestore().collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res
          .status(404)
          .send({success: false, message: "User not found."});
    }

    const blockedUsers =
      (userDoc.data() &&
        userDoc.data().privacySettings &&
        userDoc.data().privacySettings.blockedUsers) ||
      {};

    const blockedUids = Object.keys(blockedUsers);

    if (blockedUids.length === 0) {
      return res.status(200).send({success: true, blockedUsers: []});
    }

    const blockedUserData = [];
    for (const blockedUid of blockedUids) {
      const blockedUserRef = admin
          .firestore()
          .collection("users")
          .doc(blockedUid);
      const blockedUserDoc = await blockedUserRef.get();

      if (blockedUserDoc.exists) {
        const data = blockedUserDoc.data();

        blockedUserData.push({
          uid: blockedUserDoc.id,
          name: data.name || "Unknown",
          birthday: data.birthday || "Unknown",
          photo: data.photos[0] || null,
        });
      }
    }

    res.status(200).send({success: true, blockedUsers: blockedUserData});
  } catch (error) {
    console.error("❌ Error fetching blocked users:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while retrieving blocked users.",
    });
  }
});

module.exports = router;
