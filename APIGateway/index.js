const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

// Thêm middleware debug
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Log biến môi trường để debug
console.log("Environment variables:", {
  PORT: process.env.PORT,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL,
  ADDRESS_SERVICE_URL: process.env.ADDRESS_SERVICE_URL,
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL,
  SHOPPING_CART_SERVICE_URL: process.env.SHOPPING_CART_SERVICE_URL,
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL,
  REVIEW_SERVICE_URL: process.env.REVIEW_SERVICE_URL,
  STATISTICS_SERVICE_URL: process.env.STATISTICS_SERVICE_URL,
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
});

// Kiểm tra biến môi trường
const requiredEnvVars = [
  "PORT",
  "AUTH_SERVICE_URL",
  "USER_SERVICE_URL",
  "PRODUCT_SERVICE_URL",
  "ADDRESS_SERVICE_URL",
  "ORDER_SERVICE_URL",
  "SHOPPING_CART_SERVICE_URL",
  "NOTIFICATION_SERVICE_URL",
  "REVIEW_SERVICE_URL",
  "STATISTICS_SERVICE_URL",
  "PAYMENT_SERVICE_URL",
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);
if (missingEnvVars.length > 0) {
  console.error("Missing environment variables:", missingEnvVars);
  process.exit(1);
}

// Proxy Swagger UI cho các service
app.use(
  "/api-docs/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/auth": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/auth:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api-docs/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/users": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/users:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api-docs/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/products": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/products:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api-docs/addresses",
  createProxyMiddleware({
    target: process.env.ADDRESS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/addresses": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/addresses:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api-docs/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/orders": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/orders:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api-docs/shopping-carts",
  createProxyMiddleware({
    target: process.env.SHOPPING_CART_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/shopping-carts": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/shopping-carts:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api-docs/notifications",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/notifications": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/notifications:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api-docs/reviews",
  createProxyMiddleware({
    target: process.env.REVIEW_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/reviews": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/reviews:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api-docs/statistics",
  createProxyMiddleware({
    target: process.env.STATISTICS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/statistics": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/statistics:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api-docs/payments",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api-docs/payments": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api-docs/payments:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/greenveggies-api-docs",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/greenveggies-api-docs": "/greenveggies-api-docs" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /greenveggies-api-docs:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "/api/auth" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/auth:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api/user",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    timeout: 10000,
    proxyTimeout: 10000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/user:", err.message);
      res.status(500).json({ error: "Proxy error", details: err.message });
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        "Proxying request to:",
        process.env.USER_SERVICE_URL + req.url
      );
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(
        "Received response from:",
        process.env.USER_SERVICE_URL + req.url
      );
    },
  })
);

app.use(
  "/api/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/products": "/api/products" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/products:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api/address",
  createProxyMiddleware({
    target: process.env.ADDRESS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/address": "/api/address" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/address:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/orders": "/api/orders" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/orders:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api/shopping-carts",
  createProxyMiddleware({
    target: process.env.SHOPPING_CART_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/shopping-carts": "/api/shopping-carts" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/shopping-carts:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api/notifications",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/notifications": "/api/notifications" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/notifications:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api/reviews",
  createProxyMiddleware({
    target: process.env.REVIEW_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/reviews": "/api/reviews" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/reviews:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api/statistics",
  createProxyMiddleware({
    target: process.env.STATISTICS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/statistics": "/api/statistics" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/statistics:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

app.use(
  "/api/payments",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/payments": "/api/payments" },
    timeout: 5000,
    proxyTimeout: 5000,
    onError: (err, req, res) => {
      console.error("Proxy error for /api/payments:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

// Route mặc định
app.get("/", (req, res) => {
  res.send(`
    <h1>API Gateway is running</h1>
    <p>Access Swagger UI for each service:</p>
    <ul>
      <li><a href="/greenveggies-api-docs">Auth Service (direct)</a></li>
      <li><a href="/api-docs/auth">Auth Service</a></li>
      <li><a href="/api-docs/users">User Service</a></li>
      <li><a href="/api-docs/products">Product Service</a></li>
      <li><a href="/api-docs/addresses">Address Service</a></li>
      <li><a href="/api-docs/orders">Order Service</a></li>
      <li><a href="/api-docs/shopping-carts">Shopping Cart Service</a></li>
      <li><a href="/api-docs/notifications">Notification Service</a></li>
      <li><a href="/api-docs/reviews">Review Service</a></li>
      <li><a href="/api-docs/statistics">Statistics Service</a></li>
      <li><a href="/api-docs/payments">Payment Service</a></li>
    </ul>
  `);
});

// Khởi động server
const PORT = process.env.PORT || 8000;
console.log(`Configured PORT: ${process.env.PORT}`);
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Swagger UI for services available at http://localhost:${PORT}`);
  console.log(
    `Direct Swagger UI at http://localhost:${PORT}/greenveggies-api-docs`
  );
});
