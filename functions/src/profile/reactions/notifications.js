const admin = require("../utils/firebaseAdmin");
const { FieldValue } = require("firebase-admin/firestore");

/**
 * Función para crear una notificación
 * @param {string} userId - ID del usuario que recibirá la notificación
 * @param {string} message - Mensaje de la notificación
 * @param {string} type - Tipo de notificación (e.g., "like", "message", "profile_view")
 */
const createNotification = async (userId, message, type, deviceToken) => {
  try {
    // Referencia a la colección de notificaciones del usuario
    const notificationRef = admin.firestore()
      .collection("notifications")
      .doc(userId)
      .collection("userNotifications")
      .doc();

    // Guardar la notificación en Firestore
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

module.exports = { createNotification };