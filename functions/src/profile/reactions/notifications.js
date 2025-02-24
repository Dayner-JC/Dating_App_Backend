const admin = require("../../utils/firebaseAdmin");
const {FieldValue} = require("firebase-admin/firestore");

/**
 * @param {string} userId
 * @param {string} message
 * @param {string} type
 */
const createNotification = async (userId, message, type) => {
  try {
    const notificationRef = admin.firestore()
        .collection("notifications")
        .doc(userId)
        .collection("userNotifications")
        .doc();

    await notificationRef.set({
      message,
      type,
      read: false,
      timestamp: FieldValue.serverTimestamp(),
    });

    console.log("Notificación creada:", notificationRef.id);
  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
};

module.exports = {createNotification};
