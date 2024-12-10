const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "dating-app-7a6f7.appspot.com",
});

if (process.env.FIREBASE_EMULATOR_HOST) {
  const {auth, firestore, storage} = admin;

  const emulatorHost = "127.0.0.1";
  const authPort = 9099;
  const firestorePort = 8080;
  const storagePort = 9199;

  auth().useEmulator(`http://${emulatorHost}:${authPort}`);

  firestore().settings({
    host: `${emulatorHost}:${firestorePort}`,
    ssl: false,
  });

  storage().useEmulator(emulatorHost, storagePort);
}

module.exports = admin;
