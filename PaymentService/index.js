const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const credentials = require("./firebaseConfig.json");

console.log("[PaymentService] Starting Payment Service");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

dotenv.config();
console.log("[PaymentService] Environment variables loaded:", {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL ? "Set" : "Not set",
});

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://green-veggies-sage.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

console.log("[PaymentService] Loading Swagger setup");
const swaggerSetup = require("./swagger");

async function connectDB() {
  try {
    console.log("[PaymentService] Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("[PaymentService] Connected to MongoDB");
  } catch (err) {
    console.error("[PaymentService] Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

connectDB();

app.use(cors());
app.use(express.json());

console.log("[PaymentService] Setting up Swagger");
swaggerSetup(app);

console.log("[PaymentService] Mounting routers");
const routerDir = require("path").join(__dirname, "src", "routers");
const routerFiles = require("fs")
  .readdirSync(routerDir)
  .filter((file) => file.endsWith(".js"));
console.log("[PaymentService] Router files in src/routers:", routerFiles);

app.use("/api/payments", require("./src/routers/payment"));
console.log("[PaymentService] Mounted /api/payments");

app.listen(process.env.PORT, () => {
  console.log("Payment Service is running on port:", process.env.PORT);
  console.log("Swagger is running on:");
  console.log(`http://localhost:${process.env.PORT}/greenveggies-api-docs`);
});
