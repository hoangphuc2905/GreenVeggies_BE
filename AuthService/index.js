const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const credentials = require("../firebaseConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

dotenv.config();
const app = express();
const swaggerSetup = require("./swagger");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

connectDB();

app.use(cors());
app.use(express.json());

//Swagger
swaggerSetup(app);

//Routes
app.use("/api/auth", require("./src/routes/auth"));

app.listen(8001, () => {
  console.log("Server is running on port 8001");
  console.log("Swagger is running on:");
  console.log("http://localhost:8001/greenveggies-api-docs");
});
