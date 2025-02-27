// Save as app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let users = [
  { username: 'administrator', password: 'secret', role: 'admin' },
  { username: 'carlos', password: 'password123', role: 'user' },
  { username: 'wiener', password: 'peter', role: 'user' }
];

// Vulnerable login endpoint
app.post('/login', (req, res) => {
  // Server uses LAST parameter if duplicates exist
  const username = req.body.username; 
  const password = req.body.password;

  const user = users.find(u => 
    u.username === username && 
    u.password === password
  );

  if (user) {
    res.send(`Logged in as ${username} (${user.role})`);
  } else {
    res.status(401).send('Login failed');
  }
});

// Vulnerable delete endpoint
app.post('/delete', (req, res) => {
  const targetUser = req.body.user;
  
  // Server uses LAST role parameter
  const isAdmin = req.body.role === 'admin'; 
  
  if (isAdmin) {
    users = users.filter(u => u.username !== targetUser);
    res.send(`${targetUser} deleted successfully`);
  } else {
    res.status(403).send('Admin privileges required');
  }
});

// Test interface
app.get('/', (req, res) => {
  res.send(`
    <h1>Parameter Pollution Lab</h1>
    
    <h2>Login</h2>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <button>Login</button>
    </form>

    <h2>Delete User</h2>
    <form action="/delete" method="POST">
      <input type="text" name="user" placeholder="Username">
      <button>Delete</button>
    </form>
  `);
});

app.listen(3000, () => {
  console.log('Lab running on http://localhost:3000');
});