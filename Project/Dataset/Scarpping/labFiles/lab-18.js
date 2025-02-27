const express = require('express');
const app = express();

app.get('/products', (req, res) => {
  let injectedCategory;
  try {
    injectedCategory = JSON.parse(req.query.category);
  } catch (err) {
    injectedCategory = req.query.category;
  }
  
  const products = [
    { id: 1, name: 'Product A', category: 'Gifts', released: true },
    { id: 2, name: 'Product B', category: 'Electronics', released: true },
    { id: 3, name: 'Secret Product', category: 'Gifts', released: false }
  ];
  
  let result;
  // Normal behavior: only show released products matching the category
  if (typeof injectedCategory === 'string') {
    result = products.filter(p => p.category === injectedCategory && p.released === true);
  }
  // Vulnerable behavior: if injection occurs, bypass the 'released' filter to show unreleased products
  else if (typeof injectedCategory === 'object' && injectedCategory.$ne !== undefined) {
    result = products.filter(p => p.category !== injectedCategory.$ne);
  } else {
    result = [];
  }
  
  res.send(result);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
