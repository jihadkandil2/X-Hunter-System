const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory user database
let users = {
  "wiener": { password: "peter" },
  "carlos": { password: "oldpass" }
};

// Weak reset token generator based on current minute (vulnerable to timing attacks)
function generateResetToken() {
  const minute = new Date().getMinutes();
  return "reset" + minute;
}

// Endpoint to request a password reset (token is returned in the response)
app.get('/request-reset', (req, res) => {
  const username = req.query.username;
  if (users[username]) {
    const token = generateResetToken();
    res.send(`Password reset token for ${username}: ${token}`);
  } else {
    res.send("User not found.");
  }
});

// Vulnerable password reset endpoint
app.post('/reset-password', (req, res) => {
  const { username, token, newPassword } = req.body;
  // Vulnerability: token generated solely on current minute
  if (users[username] && token === generateResetToken()) {
    users[username].password = newPassword;
    res.send(`Password reset successful for ${username}.`);
  } else {
    res.send("Invalid token or username.");
  }
});

// GET route for login form (added for completeness)
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

// Login endpoint (processes login form)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    res.send(`Welcome, ${username}!`);
  } else {
    res.send("Invalid credentials.");
  }
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Password Reset Lab - Exploiting Time-Sensitive Vulnerabilities</h1>
    <p>This lab demonstrates a vulnerability in a password reset mechanism due to weak, time-based token generation.</p>
    <ul>
      <li>Request a reset token at: <code>/request-reset?username=wiener</code></li>
      <li>The token is generated as <code>reset</code> + current minute (e.g., if minute=15, token = <code>reset15</code>).</li>
      <li>Reset the password by POSTing to <code>/reset-password</code> with parameters: <em>username</em>, <em>token</em>, and <em>newPassword</em>.</li>
      <li>Then log in using the credentials: <strong>wiener</strong> / <strong>peter</strong>.</li>
      <li>A login form is available at: <a href="/login">/login</a></li>
    </ul>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
