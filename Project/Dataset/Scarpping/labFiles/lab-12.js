    // Save as app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let products = [
  { id: 1, name: 'Lightweight l33t Leather Jacket', price: 1000, available: false }
];

// Visible routes
app.get('/', (req, res) => {
  res.send(`
    <h1>E-Commerce Lab</h1>
    <a href="/login">Login</a><br>
    <a href="/products">View Products</a>
  `);
});

app.get('/products', (req, res) => {
  res.send(`
    <h2>Products</h2>
    <p>Lightweight l33t Leather Jacket: ${products[0].available ? 'Available' : 'Out of stock'}</p>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'wiener' && password === 'peter') {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Hidden vulnerable endpoint
app.post('/api/admin/update-product', (req, res) => {
  const { productId, available } = req.body;
  const product = products.find(p => p.id === productId);
  
  if (product) {
    product.available = available;
    res.send('Product updated');
  } else {
    res.status(404).send('Product not found');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});