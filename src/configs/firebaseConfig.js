// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBkaODLEwWfmtL81SjkmdocZ_f-sIrueuM",
//   authDomain: "greenveggies-8e464.firebaseapp.com",
//   projectId: "greenveggies-8e464",
//   storageBucket: "greenveggies-8e464.firebasestorage.app",
//   messagingSenderId: "820838805356",
//   appId: "1:820838805356:web:c012eee8e54d02f0a1cd49"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
