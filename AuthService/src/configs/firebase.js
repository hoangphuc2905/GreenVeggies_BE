const admin = require("firebase-admin");
const credentials = require("../../firebaseConfig.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

module.exports = admin;
