const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const credentials = require("./firebaseConfig.json");

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
app.use("/api/user", require("./src/routers/user"));
app.use("/api/products", require("./src/routers/product"));
app.use("/api/auth", require("./src/routers/auth"));
app.use("/api/address", require("./src/routers/address"));
app.use("/api/categories", require("./src/routers/category"));
app.use("/api/reviews", require("./src/routers/review"));
app.use("/api/orders", require("./src/routers/order"));
app.use("/api/shopping-carts", require("./src/routers/shopping"));
app.use("/api/payments", require("./src/routers/payment"));
app.use("/api/notifications", require("./src/routers/notification"));
app.use("/api/statistics", require("./src/routers/statistics"));

app.listen(8000, () => {
  console.log("Server is running on port 8000");
  console.log("Swagger is running on:");
  console.log("http://localhost:8000/greenveggies-api-docs");
});
