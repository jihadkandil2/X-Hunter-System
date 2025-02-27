const express = require('express');
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

// Simulated in-memory cache to mimic exact-match cache normalization
let cache = {
  carlosApiKey: 'initial-api-key'
};

// Login page for user authentication
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

// Vulnerable login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Valid credentials: wiener / peter
  if (username === 'wiener' && password === 'peter') {
    req.session.user = username;
    res.send(`
      <h1>Welcome, ${username}!</h1>
      <p>You are now logged in.</p>
      <p><a href="/update-api-key">Update API Key</a></p>
      <p><a href="/api-key">View API Key for carlos</a></p>
    `);
  } else {
    res.send("Invalid credentials. Please try again.");
  }
});

// Vulnerable route to update carlos's API key (exploiting cache normalization)
app.get('/update-api-key', (req, res) => {
  if (!req.session.user) {
    return res.send("Please log in first.");
  }
  res.send(`
    <h1>Update API Key</h1>
    <form method="POST" action="/update-api-key">
      <label for="apikey">New API Key for carlos:</label><br><br>
      <input type="text" id="apikey" name="apikey"><br><br>
      <button type="submit">Update API Key</button>
    </form>
    <p>Hint: Use various delimiter characters if needed.</p>
  `);
});

// Vulnerable update route (POST) for API key
app.post('/update-api-key', (req, res) => {
  if (!req.session.user) {
    return res.send("Please log in first.");
  }
  const newApiKey = req.body.apikey;
  // Vulnerable: Directly updating the cache without proper access control
  cache.carlosApiKey = newApiKey;
  res.send(`API Key for carlos updated to: ${newApiKey}. <a href="/api-key">View API Key</a>`);
});

// Endpoint to view the cached API key for carlos
app.get('/api-key', (req, res) => {
  res.send(`<h1>API Key for carlos</h1><p>${cache.carlosApiKey}</p>`);
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Web Cache Deception Lab - API Key Retrieval</h1>
    <p>This lab demonstrates a web cache deception vulnerability caused by exact-match cache normalization.</p>
    <ul>
      <li>Log in using the credentials: <strong>wiener</strong> / <strong>peter</strong></li>
      <li>Go to <a href="/update-api-key">Update API Key</a> to change the API key for carlos.</li>
      <li>Then, view the result at <a href="/api-key">View API Key</a>.</li>
      <li>Hint: Use various delimiter characters as provided in the lab instructions.</li>
    </ul>
    <p><a href="/login">Login Here</a></p>
  `);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});