const express = require("express");
const proxy = require("http-proxy-middleware");

const app = express();

app.use("/api/auth", proxy({ target: "http://localhost:5001", changeOrigin: true }));
app.use("/api/users", proxy({ target: "http://localhost:5002", changeOrigin: true }));
app.use("/api/products", proxy({ target: "http://localhost:5003", changeOrigin: true }));
// app.use("/api/orders", proxy({ target: "http://localhost:5004", changeOrigin: true }));
// app.use("/api/payments", proxy({ target: "http://localhost:5005", changeOrigin: true }));
// app.use("/api/reviews", proxy({ target: "http://localhost:5006", changeOrigin: true }));

app.listen(5000, () => console.log("API Gateway running on port 5000"));
