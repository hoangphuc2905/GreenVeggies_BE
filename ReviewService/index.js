const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
const swaggerSetup = require("./swagger");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

connectDB();

app.use(cors());
app.use(express.json());

// Swagger setup
swaggerSetup(app);

// Routes
app.use("/api/reviews", require("./src/routers/review"));

app.listen(process.env.PORT, () => {
  console.log(`ReviewService is running on port ${process.env.PORT}`);
  console.log("Swagger is running on:");
  console.log(`http://localhost:${process.env.PORT}/greenveggies-api-docs`);
});
