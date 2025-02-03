/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();

const helpItems = [
  {
    title: "How do I edit my profile?",
    category: "Account & Profile",
    description:
      "Go to the \"My Account\" section and click \"View Profile.\" From there, you can update your name, profile picture, preferences, and other details.",
  },
  {
    title: "How do matches work?",
    category: "Matches & Messaging",
    description:
      "Matches occur when both you and another user like each other’s profiles. Once matched, you can start a conversation.",
  },
  {
    title: "How do I delete my account?",
    category: "Account & Profile",
    description:
      "Go to \"Settings\" and select \"Delete Account.\" Please note that this action is permanent.",
  },
  {
    title: "Can I recover a deleted account?",
    category: "Account & Profile",
    description:
      "Unfortunately, deleted accounts cannot be recovered. You’ll need to create a new account if you wish to use the app again.",
  },
  {
    title: "How do I block someone?",
    category: "Privacy & Security",
    description:
      "Go to the user’s profile or chat, click the menu (three dots), and select \"Block User.\" Once blocked, they will not be able to contact you.",
  },
  {
    title: "How do I update the app?",
    category: "Technical Issues",
    description:
      "Visit the Google Play Store or Apple App Store, search for Dating App, and click \"Update\" if an update is available.",
  },
  {
    title: "Why can’t I send messages?",
    category: "Matches & Messaging",
    description:
      "You can only send messages to users you’ve matched with. If you’re having technical issues, make sure your app is updated to the latest version.",
  },
  {
    title: "How do I report inappropriate behavior?",
    category: "Matches & Messaging",
    description:
      "Open the user’s profile or the chat window, click on the menu (three dots), and select \"Report User.\" Provide a reason and submit the report.",
  },
  {
    title: "Is my data safe on this app?",
    category: "Privacy & Security",
    description:
      "Yes, we use advanced encryption methods to protect your data. For more details, refer to our Privacy Policy.",
  },
  {
    title: "I found a bug. How can I report it?",
    category: "Technical Issues",
    description:
      "Go to \"Help Center\" > \"Contact Us\" and describe the issue in detail using our email address. Include screenshots if possible to help us resolve the issue faster.",
  },
  {
    title: "What happens when I report a user?",
    category: "Privacy & Security",
    description:
      "Our moderation team will review your report and take appropriate action. For privacy reasons, we cannot share the results of our investigation.",
  },
  {
    title: "Why is the app not loading?",
    category: "Technical Issues",
    description:
      "Check your internet connection and ensure you’re using the latest version of the app. If the issue persists, try restarting your device or reinstalling the app.",
  },
];

router.get("/help_center/get", (req, res) => {
  try {
    res.status(200).json(helpItems);
  } catch (error) {
    res.status(500).json({message: "Error fetching help items", error});
  }
});

module.exports = router;
