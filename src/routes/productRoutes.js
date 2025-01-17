const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/products.json');

// Get all products
router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(dataPath));
  res.json(products);
});

// Get a product by ID
router.get('/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(dataPath));
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Add a new product
router.post('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(dataPath));
  const newProduct = {
    id: products.length + 1,
    ...req.body,
  };
  products.push(newProduct);
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

// Update a product
router.put('/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(dataPath));
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...req.body };
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Delete a product
router.delete('/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(dataPath));
  const filteredProducts = products.filter(p => p.id !== parseInt(req.params.id));
  if (filteredProducts.length !== products.length) {
    fs.writeFileSync(dataPath, JSON.stringify(filteredProducts, null, 2));
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;
