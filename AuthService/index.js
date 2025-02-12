const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const admin = require("./config/firebase");
const swaggerSetup = require("./swagger");

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Swagger
swaggerSetup(app);

// Routes
app.use("/api/auth", require("./routers/auth"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`AuthService is running on port ${PORT}`);
  console.log(
    `Swagger API Docs: http://localhost:${PORT}/greenveggies-api-docs`
  );
});
