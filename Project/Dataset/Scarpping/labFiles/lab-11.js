const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let products = [
  { id: 1, name: 'Lightweight l33t Leather Jacket', price: 100, available: false }
];

// Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>Mass Assignment Lab</h1>
    <p>Send a POST request to /buy with a JSON payload to exploit the vulnerability.</p>
    <p>Example payload: {"id": 2, "name": "Hacked Jacket", "price": 0, "available": true}</p>
  `);
});

// Vulnerable route
app.post('/buy', (req, res) => {
  const product = req.body;
  products.push(product);
  res.send(`Product purchased: ${JSON.stringify(product)}`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});