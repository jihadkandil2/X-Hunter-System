const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Setup session middleware
app.use(session({
  secret: 'prototype_detection_lab_secret',
  resave: false,
  saveUninitialized: true
}));

// For detection, we set a default property on Object.prototype
if (Object.prototype.message === undefined) {
  Object.prototype.message = "Server is safe";
}

// Login page route
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

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Valid credentials for lab: wiener / peter
  if (username === 'wiener' && password === 'peter') {
    req.session.user = username;
    res.send(`Welcome, ${username}! <a href="/update">Go to Update Config</a> | <a href="/check">Check Server Message</a>`);
  } else {
    res.send("Invalid credentials.");
  }
});

// Vulnerable endpoint: unsafely merge user input into Object.prototype via a flawed merge
app.post('/update', (req, res) => {
  if (!req.session.user) {
    return res.send("Please log in first.");
  }
  const payload = req.body.payload;
  try {
    const userInput = JSON.parse(payload);
    // Vulnerable merge: if the payload contains a __proto__ key, pollute Object.prototype
    if (userInput.__proto__) {
      Object.assign(Object.prototype, userInput.__proto__);
    } else {
      // Alternatively, merge directly if the payload is an object
      Object.assign(Object.prototype, userInput);
    }
    res.send("Configuration updated successfully.");
  } catch (e) {
    res.send("Invalid JSON payload.");
  }
});

// Endpoint to check the effect of prototype pollution
app.get('/check', (req, res) => {
  // This will reflect the current value of the 'message' property on Object.prototype
  res.send(`<h1>Server Message: ${{}.message}</h1>`);
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Prototype Pollution Detection Lab</h1>
    <p>This lab demonstrates a vulnerability due to unsafe merging of user-controllable input into Object.prototype.</p>
    <ul>
      <li>Log in using credentials: <strong>wiener</strong> / <strong>peter</strong></li>
      <li>Submit a JSON payload to <code>/update</code> that polls Object.prototype. For example: <code>{ "__proto__": { "message": "Polluted!" } }</code></li>
      <li>Then visit <code>/check</code> to see if the server message changes from "Server is safe" to "Polluted!"</li>
      <li><a href="/login">Login Here</a></li>
    </ul>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
