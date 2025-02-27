const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Intentionally vulnerable merge function
const safeMerge = (target, source) => {
  for (const key in source) {
    if (key === '__proto__' || key === 'constructor') continue;
    if (typeof target[key] === 'object' && typeof source[key] === 'object') {
      safeMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

// Detection endpoint
app.post('/profile', (req, res) => {
  const userInput = req.body.settings || {};
  const baseConfig = { theme: 'light' };
  
  // Vulnerable merge
  const mergedConfig = safeMerge({}, baseConfig);
  safeMerge(mergedConfig, userInput);

  // Pollution detection mechanism
  const responseDelay = mergedConfig.delay || 0;
  
  setTimeout(() => {
    res.json({
      status: 'success',
      theme: mergedConfig.theme
    });
  }, responseDelay);
});

// Authentication
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.send(username === 'wiener' && password === 'peter' ? 'Logged in' : 'Login failed');
});

app.listen(3000, () => {
  console.log('Lab running on http://localhost:3000');
});