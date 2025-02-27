const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Setup session middleware
app.use(session({
  secret: 'prototype_pollution_lab_secret',
  resave: false,
  saveUninitialized: true
}));

// Basic user database
const users = {
  "wiener": { password: "peter", role: "admin" },
  "carlos": { password: "carlospass", role: "user" }
};

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
  if (users[username] && users[username].password === password) {
    req.session.user = username;
    res.send(`Welcome, ${username}! <a href="/admin">Go to Admin Panel</a>`);
  } else {
    res.send("Invalid credentials.");
  }
});

// Admin panel route
app.get('/admin', (req, res) => {
  if (!req.session.user || users[req.session.user].role !== 'admin') {
    return res.send("Access Denied.");
  }
  res.send(`
    <h1>Admin Panel</h1>
    <p>You have admin privileges.</p>
    <form method="POST" action="/admin/update-config">
      <label for="config">Update Config (JSON):</label><br>
      <input type="text" id="config" name="config" placeholder='e.g., { "command": "rm -rf /home/carlos" }'><br><br>
      <button type="submit">Update Config and Execute</button>
    </form>
    <p>Hint: The input filter blocks the string "__proto__". Try bypassing it using alternative key names.</p>
  `);
});

// Vulnerable endpoint: unsafely merge user input into a config object (prototype pollution)
app.post('/admin/update-config', (req, res) => {
  if (!req.session.user || users[req.session.user].role !== 'admin') {
    return res.send("Access Denied.");
  }
  let config = { command: "echo Safe" };
  
  // Flawed input filter: blocks input if it contains the exact string "__proto__"
  const userInput = req.body.config;
  if (userInput.includes("__proto__")) {
    return res.send("Input not allowed.");
  }
  
  try {
    const userConfig = JSON.parse(userInput);
    Object.assign(config, userConfig);
  } catch (e) {
    return res.send("Invalid input format.");
  }
  
  exec(config.command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing command:", error.message);
      return res.status(500).send("Command execution error: " + error.message);
    }
    res.send(`Command executed: ${stdout}`);
  });
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Prototype Pollution Lab - Bypassing Flawed Input Filters</h1>
    <p>This lab is built on Node.js and Express. It is vulnerable to server-side prototype pollution because it unsafely merges user-controllable input into a configuration object.</p>
    <ul>
      <li>Log in using: <strong>wiener</strong> / <strong>peter</strong></li>
      <li>Access the Admin Panel at <a href="/admin">/admin</a> to update the configuration.</li>
      <li>Bypass the input filter (which blocks "__proto__") using alternative key names.</li>
      <li>For example, update the config to set a dangerous command (e.g., <code>rm -rf /home/carlos</code>).</li>
    </ul>
    <p><a href="/login">Login Here</a></p>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
