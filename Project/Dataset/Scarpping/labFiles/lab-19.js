const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Simulated in-memory user database
let users = [];

// Simulated email verification process with delay (introducing a race condition)
function verifyEmail(email, callback) {
  // Simulate an asynchronous email verification delay (e.g., sending an email)
  setTimeout(() => {
    // For lab purposes, email is marked as verified after delay
    callback(true);
  }, 2000); // 2-second delay
}

// Registration endpoint vulnerable to race conditions
app.post('/register', (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  
  // Check if the email is already registered
  if (users.find(u => u.email === email)) {
    return res.send("Email already registered.");
  }
  
  // Begin email verification asynchronously
  verifyEmail(email, (verified) => {
    if (verified) {
      // Race condition: if multiple requests arrive concurrently,
      // this check may be bypassed
      if (!users.find(u => u.email === email)) {
        users.push({ email, username });
        res.send(`User registered with email: ${email}`);
      } else {
        res.send("Registration already processed.");
      }
    } else {
      res.send("Email verification failed.");
    }
  });
});

// Login endpoint (for simplicity, no password here)
app.post('/login', (req, res) => {
  const { email, username } = req.body;
  const user = users.find(u => u.email === email && u.username === username);
  if (user) {
    res.send(`Welcome, ${username}!`);
  } else {
    res.send("Invalid credentials.");
  }
});

// Admin endpoint to delete user 'carlos'
app.post('/admin/delete-carlos', (req, res) => {
  users = users.filter(u => u.username !== 'carlos');
  res.send("User carlos has been deleted.");
});

// Root route with instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>User Registration Race Condition Lab</h1>
    <p>This lab simulates a race condition in a user registration mechanism. A delay in email verification allows an attacker to bypass the check and register with an arbitrary email address.</p>
    <ul>
      <li>To solve the lab, exploit the race condition to register with an arbitrary email address (that you do not own), then log in and delete user carlos.</li>
      <li>Registration endpoint: POST /register with parameters: email, username</li>
      <li>Login endpoint: POST /login with parameters: email, username</li>
      <li>Admin deletion endpoint: POST /admin/delete-carlos</li>
    </ul>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
