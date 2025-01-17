const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/products', productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
