const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Load biến môi trường
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Proxy đến Auth Service
app.use("/api/auth", createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' } 
}));

// Proxy đến User Service
app.use("/api/users", createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

// Proxy đến Product Service
app.use("/api/products", createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/products': '' }
}));

// Proxy đến Address Service
app.use("/api/address", createProxyMiddleware({
  target: process.env.ADDRESS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/address': '' }
}));

// // Proxy đến Order Service
// app.use("/api/orders", createProxyMiddleware({
//   target: process.env.ORDER_SERVICE_URL,
//   changeOrigin: true,
//   pathRewrite: { '^/api/orders': '' }
// }));

// // Proxy đến Payment Service
// app.use("/api/payments", createProxyMiddleware({
//   target: process.env.PAYMENT_SERVICE_URL,
//   changeOrigin: true,
//   pathRewrite: { '^/api/payments': '' }
// }));

// // Proxy đến Review Service
// app.use("/api/reviews", createProxyMiddleware({
//   target: process.env.REVIEW_SERVICE_URL,
//   changeOrigin: true,
//   pathRewrite: { '^/api/reviews': '' }
// }));

// Khởi chạy server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
