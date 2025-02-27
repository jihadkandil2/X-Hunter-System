
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Setup session middleware
app.use(session({
  secret: 'lab_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Vulnerable caching mechanism using path mapping
let cache = {};

// Vulnerable path mapping function: simply trims whitespace and trailing slashes
function mapPathToCacheKey(path) {
  return path.trim().replace(/\/+$/, '');
}

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
  // Valid credentials for this lab: wiener / peter
  if (username === 'wiener' && password === 'peter') {
    req.session.user = username;
    res.send(`
      <h1>Welcome, ${username}!</h1>
      <p>You are now logged in.</p>
      <p><a href="/secret">Access Secret</a></p>
    `);
  } else {
    res.send("Invalid credentials. Please try again.");
  }
});

// Vulnerable route: returns API key using a cache key derived from the request path
app.get('/secret', (req, res) => {
  const cacheKey = mapPathToCacheKey(req.originalUrl);
  if (cache[cacheKey]) {
    res.send(`<h1>Cached API Key</h1><p>${cache[cacheKey]}</p>`);
  } else {
    const apiKey = 'carlos-secret-api-key';
    cache[cacheKey] = apiKey;
    res.send(`<h1>API Key Generated</h1><p>${apiKey}</p>`);
  }
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Web Cache Deception Lab - Exploiting Path Mapping</h1>
    <p>This lab demonstrates a vulnerability due to improper normalization in path mapping for caching.</p>
    <ul>
      <li>Log in using credentials: <strong>wiener</strong> / <strong>peter</strong></li>
      <li>After login, access <code>/secret</code> to view the API key for user carlos.</li>
      <li>Try manipulating the URL—for example, by adding extra slashes or encoding parts—to bypass normalization and generate a new cache key.</li>
      <li>Example: <code>/secret</code> vs <code>//secret</code></li>
    </ul>
    <p><a href="/login">Login Here</a></p>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
