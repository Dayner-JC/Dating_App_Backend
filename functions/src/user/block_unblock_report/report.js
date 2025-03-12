/* eslint-disable new-cap */
const express = require("express");
const admin = require("../../utils/firebaseAdmin");
const nodemailer = require("nodemailer");
const router = express.Router();
const {FieldValue} = require("firebase-admin/firestore");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "daynercespedes4@gmail.com",
    pass: "vaoclbdyuotfsyvo",
  },
});

router.post("/user/block_unblock_report/report", async (req, res) => {
  const {reporterUid, reportedUid, reason, otherText} = req.body;

  if (!reporterUid || !reportedUid || !reason) {
    return res.status(400).send({
      success: false,
      message: "ReporterUid, reportedUid, and reason are required.",
    });
  }

  try {
    const reporterDoc = await admin
        .firestore()
        .collection("users")
        .doc(reporterUid)
        .get();

    if (!reporterDoc.exists) {
      return res.status(404).send({
        success: false,
        message: "The reporting user was not found.",
      });
    }
    const reporterData = reporterDoc.data();
    const reporterName = reporterData.name;

    const reportedDoc = await admin
        .firestore()
        .collection("users")
        .doc(reportedUid)
        .get();

    if (!reportedDoc.exists) {
      return res.status(404).send({
        success: false,
        message: "The reported user was not found.",
      });
    }
    const reportedData = reportedDoc.data();
    const reportedName = reportedData.name;

    const finalReason =
      reason === "Other" ? otherText || "No additional details" : reason;

    if (
      reporterData.privacySettings &&
      reporterData.privacySettings.reportedUsers &&
      reporterData.privacySettings.reportedUsers[reportedUid]
    ) {
      return res.status(400).send({
        success: false,
        message: "Sorry you have already reported this user before," +
        "we are unable to process your request",
      });
    }

    const reportEntry = {
      reportedAt: FieldValue.serverTimestamp(),
      reason: finalReason,
    };

    await admin
        .firestore()
        .collection("users")
        .doc(reporterUid)
        .update({
          [`privacySettings.reportedUsers.${reportedUid}`]: reportEntry,
        });

    const mailOptions = {
      from: "daynercespedes4@gmail.com",
      to: "daynercespedes4@gmail.com",
      subject: `${reporterName}: User Report!`,
      text: `Report Details:

Reporting User:
${reporterName} (UID: ${reporterUid})

Reported User:
${reportedName} (UID: ${reportedUid})

Reason for the report: ${finalReason}
`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({
      success: true,
      message: "Report submitted successfully.",
    });
  } catch (error) {
    console.error("Error sending the report:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
