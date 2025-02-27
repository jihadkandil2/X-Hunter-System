// Save as app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let users = [
  { id: 1, username: 'administrator', role: 'admin' },
  { id: 2, username: 'carlos', role: 'user' },
  { id: 3, username: 'wiener', role: 'user' }
];

// Hidden API docs endpoint
app.get('/docs', (req, res) => {
  res.send(`
    <h1>Internal API Docs</h1>
    <h2>Delete User</h2>
    <pre>DELETE /api/users
Headers:
  X-API-Key: 7d8f9e0a1b2c3d4e5f6a7b8c9d0e1f2
Body:
  { "username": "target_user" }</pre>
  `);
});

// Vulnerable API endpoint
app.delete('/api/users', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const targetUser = req.body.username;

  if (apiKey === '7d8f9e0a1b2c3d4e5f6a7b8c9d0e1f2') {
    users = users.filter(u => u.username !== targetUser);
    res.send(`${targetUser} deleted successfully`);
  } else {
    res.status(403).send('Invalid API key');
  }
});

// Visible interface
app.get('/', (req, res) => {
  res.send(`
    <h1>API Docs Lab</h1>
    <a href="/login">Login</a>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'wiener' && password === 'peter') {
    res.send('Logged in as wiener');
  } else {
    res.status(401).send('Login failed');
  }
});

app.listen(3000, () => {
  console.log('Lab running on http://localhost:3000');
});