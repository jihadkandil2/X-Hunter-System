const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Setup session middleware (simulating a PHP serialization-based session mechanism)
app.use(session({
  secret: 'insecure_deserialization_secret',
  resave: false,
  saveUninitialized: true
}));

// Simulated user database
const users = {
  "wiener": { password: "peter", role: "user" },
  "carlos": { password: "carlospass", role: "user" },
  "admin": { password: "adminpass", role: "admin" }
};

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Modifying Serialized Objects Lab</h1>
    <p>This lab uses a serialization-based session mechanism and is vulnerable to privilege escalation.</p>
    <p>To solve the lab, edit the serialized object in your session cookie to escalate your privileges to admin, then access the admin panel to delete the user carlos.</p>
    <p>Log in using credentials: <strong>wiener</strong> / <strong>peter</strong>.</p>
    <p><a href="/login">Login Here</a></p>
  `);
});

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

// Login endpoint – valid credentials: wiener / peter
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    // Create a serialized session object with the user's role (initially "user")
    const sessionData = JSON.stringify({ user: username, role: users[username].role });
    // Set the cookie (unsigned so that it can be manually modified by the client)
    res.cookie("sessionData", sessionData, { httpOnly: false });
    res.send(`Logged in as ${username}. <a href="/session">View Session</a> | <a href="/admin">Admin Panel</a>`);
  } else {
    res.send("Invalid credentials.");
  }
});

// Endpoint to view current session data (for testing and manual modification)
app.get('/session', (req, res) => {
  res.send(`<h1>Session Data</h1><pre>${req.cookies.sessionData || 'No session data.'}</pre>`);
});

// Admin panel: accessible only if the session cookie indicates an admin role
app.get('/admin', (req, res) => {
  const sessionData = req.cookies.sessionData;
  if (!sessionData) return res.send("Not logged in.");
  try {
    const data = JSON.parse(sessionData);
    if (data.role === 'admin') {
      res.send(`
        <h1>Admin Panel</h1>
        <p>Welcome, admin!</p>
        <form method="POST" action="/admin/delete-carlos">
          <button type="submit">Delete User Carlos</button>
        </form>
      `);
    } else {
      res.send("Access Denied. You must be an admin to access this page.");
    }
  } catch (e) {
    res.send("Invalid session data.");
  }
});

// Admin endpoint to delete user carlos
app.post('/admin/delete-carlos', (req, res) => {
  if (users["carlos"]) {
    delete users["carlos"];
    res.send("User carlos has been deleted.");
  } else {
    res.send("User carlos does not exist.");
  }
});

app.listen(port, () => {
  console.log(`Lab running on http://localhost:${port}`);
});
