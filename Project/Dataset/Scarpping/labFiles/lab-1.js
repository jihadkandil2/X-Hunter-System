const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Setup a simple session mechanism for login simulation
app.use(session({
  secret: 'lab_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Simulated in-memory cache for the administrator email
let cache = {
  adminEmail: 'admin@example.com'
};

// Login page - GET route
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username"><br><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password"><br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Vulnerable login route - POST route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // For lab purposes, the valid credentials are: username: wiener, password: peter
  if (username === 'wiener' && password === 'peter') {
    req.session.user = username;
    res.send(`
      <h1>Welcome, ${username}!</h1>
      <p>You are now logged in.</p>
      <p><a href="/update-email">Update Admin Email</a></p>
      <p><a href="/admin-email">View Admin Email</a></p>
    `);
  } else {
    res.send("Invalid credentials. Please try again.");
  }
});

// Vulnerable route to update admin email (exploiting cache deception)
app.get('/update-email', (req, res) => {
  // Ensure the user is logged in
  if (!req.session.user) {
    return res.send("Please log in first.");
  }
  
  res.send(`
    <h1>Update Admin Email</h1>
    <form method="POST" action="/update-email">
      <label for="email">New Admin Email:</label>
      <input type="text" id="email" name="email"><br><br>
      <button type="submit">Update Email</button>
    </form>
    <p>Hint: Try adding different delimiters if needed.</p>
  `);
});

// Vulnerable update-email route (POST)
app.post('/update-email', (req, res) => {
  if (!req.session.user) {
    return res.send("Please log in first.");
  }
  const newEmail = req.body.email;
  // Vulnerable: directly update the cached admin email without proper validation
  cache.adminEmail = newEmail;
  res.send(`Admin email updated to: ${newEmail}. <a href="/admin-email">View Admin Email</a>`);
});

// Route to view the cached admin email (target of the attack)
app.get('/admin-email', (req, res) => {
  res.send(`<h1>Administrator Email</h1><p>${cache.adminEmail}</p>`);
});

// Root route with instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Web Cache Deception Lab</h1>
    <p>This lab demonstrates a web cache deception vulnerability where exact-match cache rules can be exploited to change the administrator's email.</p>
    <ul>
      <li>Log in using the credentials: <strong>wiener</strong> / <strong>peter</strong></li>
      <li>Go to <a href="/update-email">Update Admin Email</a> to change the cached email.</li>
      <li>Then, view the result at <a href="/admin-email">Admin Email</a></li>
      <li>Experiment with delimiter characters if needed as hinted in the lab instructions.</li>
    </ul>
    <p><a href="/login">Login Here</a></p>
  `);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
