const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:');

// Create a table and populate it with sample user data
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
  db.run("INSERT INTO users (username, password) VALUES ('user', 'user123')");
});

// Serve the login form
app.get('/', (req, res) => {
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
  const username = req.body.username;
  const password = req.body.password;

  // Vulnerable query: directly using user inputs without sanitization
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log("Executing query:", query);

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send("Error occurred during login.");
    } else if (rows.length > 0) {
      res.send(`Welcome, ${rows[0].username}!`);
    } else {
      res.send("Invalid credentials.");
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running at http://localhost:${PORT}`);
});
