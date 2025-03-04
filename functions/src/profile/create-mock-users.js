/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");
const router = express.Router();

router.post("/profile/create-mock-users", async (req, res) => {
  try {
    const mockUsers = [
      {
        uid: "mock-1",
        name: "Alice",
        birthday: "04/18/2004",
        gender: "woman",
        preference: "man",
        height: 165,
        intentions: "dating",
        location: {
          address: {
            country: "USA",
            state: "New York",
          },
          coordinates: {latitude: 40.7128, longitude: -74.0060},
        },
        about: "I love art and music",
        interests: ["art", "music"],
        photos: ["https://1.bp.blogspot.com/-yiT8Vnu25oU/U3ylkxToUJI/AAAAAAABvvE/8kPjYrid0JM/s1600/foto-rostro-mujer-sonriendo.jpg"],
      },
      {
        uid: "mock-2",
        name: "Bob",
        birthday: "05/05/1985",
        gender: "man",
        preference: "woman",
        height: 180,
        intentions: "friendship",
        location: {
          address: {
            country: "USA",
            state: "California",
          },
          coordinates: {latitude: 34.0522, longitude: -118.2437},
        },
        about: "Enjoys outdoor activities",
        interests: ["hiking", "cycling"],
        photos: ["https://th.bing.com/th/id/R.0301819f445a8855c4a577a6763fb62d?rik=TT%2fgaYZuz1YEig&riu=http%3a%2f%2fanhede.se%2fwp-content%2fuploads%2f2014%2f01%2f130221-2528.jpg&ehk=LToqkipED3KxGj7CVuMoQrvi487RY2HN6IPZ59FCWNQ%3d&risl=&pid=ImgRaw&r=0"],
      },
      {
        uid: "mock-3",
        name: "Carol",
        birthday: "03/03/1992",
        gender: "woman",
        preference: "man",
        height: 170,
        intentions: "relationship",
        location: {
          address: {
            country: "USA",
            state: "Illinois",
          },
          coordinates: {latitude: 41.8781, longitude: -87.6298},
        },
        about: "Passionate about cooking",
        interests: ["cooking", "reading"],
        photos: ["https://th.bing.com/th/id/OIP.0ZawL_odjBbk5MG_n-n9_QHaLH?w=119&h=180&c=7&r=0&o=5&pid=1.7"],
      },
      {
        uid: "mock-4",
        name: "Dave",
        birthday: "08/08/1988",
        gender: "man",
        preference: "woman",
        height: 175,
        intentions: "dating",
        location: {
          address: {
            country: "USA",
            state: "Florida",
          },
          coordinates: {latitude: 25.7617, longitude: -80.1918},
        },
        about: "Loves sports and travel",
        interests: ["sports", "travel"],
        photos: ["https://th.bing.com/th/id/OIP.1aKzAzSzXs-r006AVVGJ0gHaHb?w=195&h=197&c=7&r=0&o=5&pid=1.7"],
      },
      {
        uid: "mock-5",
        name: "Eve",
        birthday: "12/12/1995",
        gender: "woman",
        preference: "man",
        height: 160,
        intentions: "friendship",
        location: {
          address: {
            country: "USA",
            state: "Massachusetts",
          },
          coordinates: {latitude: 42.3601, longitude: -71.0589},
        },
        about: "Enjoys music festivals",
        interests: ["music", "art"],
        photos: ["https://th.bing.com/th/id/OIP.Nc-wLN-iEgEAzoR33z9zYgHaJQ?w=146&h=183&c=7&r=0&o=5&pid=1.7"],
      },
    ];

    const batch = admin.firestore().batch();
    const usersCollection = admin.firestore().collection("users");

    mockUsers.forEach((user) => {
      const userRef = usersCollection.doc(user.uid);
      batch.set(
          userRef,
          {
            name: user.name,
            birthday: user.birthday,
            gender: user.gender,
            preference: user.preference,
            height: user.height,
            intentions: user.intentions,
            location: user.location,
            about: user.about,
            interests: user.interests,
            photos: user.photos,
            reactions: {
              peopleYouLike: {},
              peopleYouDislike: {},
              peopleWhoLikeYou: {},
              peopleWhoDislikeYou: {},
            },
            isProfileComplete: true,
            updatedAt: FieldValue.serverTimestamp(),
          },
          {merge: true},
      );
    });

    await batch.commit();

    res.status(200).json({success: true, message: "Mock users created successfully"});
  } catch (error) {
    console.error("Error creating mock profiles:", error);
    res.status(500).json({success: false, message: "An error occurred creating mock profiles"});
  }
});

module.exports = router;
