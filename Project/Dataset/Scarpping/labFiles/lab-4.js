const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Setup session for login simulation
app.use(session({
  secret: 'lab_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Simulated cache using the raw URL as key (vulnerable to path delimiter manipulation)
let cache = {};

// Login page
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
      <p><a href="/secret">Access Secret</a></p>
      <p>Hint: Modify URL delimiters in /secret (e.g., extra slashes or encoded characters) to bypass cache normalization.</p>
    `);
  } else {
    res.send("Invalid credentials. Please try again.");
  }
});

// Vulnerable route: returns sensitive API key based on raw URL (cache key)
app.get('/secret', (req, res) => {
  // Using the raw URL as the cache key (vulnerable if URL delimiters differ)
  const cacheKey = req.originalUrl;
  if (cache[cacheKey]) {
    res.send(`<h1>Cached API Key</h1><p>${cache[cacheKey]}</p>`);
  } else {
    // For lab purposes, the sensitive API key is fixed
    const apiKey = 'carlos-secret-api-key';
    cache[cacheKey] = apiKey;
    res.send(`<h1>API Key Generated</h1><p>${apiKey}</p>`);
  }
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Web Cache Deception Lab - Exploiting Path Delimiters</h1>
    <p>This lab demonstrates a vulnerability due to improper normalization of URL path delimiters.</p>
    <ul>
      <li>Login using credentials: <strong>wiener</strong> / <strong>peter</strong></li>
      <li>After login, visit <a href="/secret">/secret</a> to see the cached API key.</li>
      <li>Experiment by modifying the URL delimiters (e.g., adding extra slashes, using encoded characters) to bypass normalization and retrieve the sensitive API key.</li>
      <li><a href="/login">Login Here</a></li>
    </ul>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
