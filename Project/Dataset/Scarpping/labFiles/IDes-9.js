const express = require('express');
const bodyParser = require('body-parser');
const serialize = require('node-serialize');

const app = express();
app.use(bodyParser.json());

// Debug information leak
app.get('/debug', (req, res) => {
  res.json({
    secret: process.env.SECRET_KEY || 'DEV_SECRET',
    status: 'debug_mode_active'
  });
});

// Vulnerable processing endpoint
app.post('/process', (req, res) => {
  try {
    const data = Buffer.from(req.body.payload, 'base64').toString();
    const obj = serialize.unserialize(data);
    res.send('Processing complete');
  } catch (e) {
    res.status(500).send('Processing error');
  }
});

// Authentication endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.send(username === 'wiener' && password === 'peter' ? 'Logged in' : 'Login failed');
});

app.listen(3000, () => {
  console.log('Lab running on port 3000');
  console.log('SECRET_KEY:', process.env.SECRET_KEY || 'DEV_SECRET');
});