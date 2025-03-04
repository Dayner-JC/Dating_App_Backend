/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const admin = require("../utils/firebaseAdmin");

const calculateAge = (birthday) => {
  const [month, day, year] = birthday.split("/");
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age.toString();
};

router.post("/get_users/get-suggestions", async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    return res.status(400).json({error: "User ID must be provided."});
  }

  try {
    const currentUserDoc = await admin.firestore().collection("users").doc(userId).get();

    if (!currentUserDoc.exists) {
      return res.status(404).json({error: "User not found."});
    }

    const currentUserData = currentUserDoc.data();

    const datingPreferences = currentUserData.datingPreferences || {
      maxDistance: 5,
      ageRange: [18, 30],
      photoRangeIndex: [1, 2],
    };

    const usersSnapshot = await admin.firestore().collection("users").get();
    let suggestions = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    suggestions = suggestions.filter((user) => {
      if (user.id === userId) {
        return false;
      }

      let age = user.age;
      if (!age && user.birthday) {
        age = parseInt(calculateAge(user.birthday), 10);
      } else {
        age = parseInt(age, 10);
      }

      const [minAge, maxAge] = datingPreferences.ageRange;
      if (maxAge !== 60 && age) {
        if (age < minAge || age > maxAge) {
          return false;
        }
      }

      if (datingPreferences.photoRangeIndex && user.photos) {
        const [minPhotos, maxPhotos] = datingPreferences.photoRangeIndex;
        const numPhotos = user.photos.length;
        if (numPhotos < minPhotos || numPhotos > maxPhotos) {
          return false;
        }
      }

      if (datingPreferences.maxDistance && datingPreferences.maxDistance !== 100) {
        if (
          user.location.coordinates &&
          currentUserData.location.coordinates
        ) {
          const userCoords = user.location.coordinates;
          const currentCoords = currentUserData.location.coordinates;
          const toRad = (value) => (value * Math.PI) / 180;
          const R = 6371;
          const dLat = toRad(userCoords.latitude - currentCoords.latitude);
          const dLon = toRad(userCoords.longitude - currentCoords.longitude);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(currentCoords.latitude)) *
              Math.cos(toRad(userCoords.latitude)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          if (distance > datingPreferences.maxDistance) {
            return false;
          }
        }
      }

      if (currentUserData.preference && currentUserData.preference !== "everyone") {
        if (user.gender !== currentUserData.preference) {
          return false;
        }
      }

      return true;
    });

    suggestions = suggestions.sort(() => Math.random() - 0.5).slice(0, 10);

    res.status(200).json({success: true, data: suggestions});
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({error: "Failed to fetch suggestions"});
  }
});

module.exports = router;
