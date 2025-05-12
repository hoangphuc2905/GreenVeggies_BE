const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const credentials = require("./firebaseConfig.json");
const jwt = require("jsonwebtoken");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());
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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json());

//Swagger
swaggerSetup(app);

//Routes
app.use("/api/user", require("./src/routers/user"));

app.listen(process.env.PORT, () => {
  console.log("UserService is running on port 8002");
  console.log("Swagger is running on:");
  console.log("http://localhost:8002/greenveggies-api-docs");
});
