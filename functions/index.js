const functions = require("firebase-functions");
const app = require("./src/App");

exports.api = functions.https.onRequest(app);
