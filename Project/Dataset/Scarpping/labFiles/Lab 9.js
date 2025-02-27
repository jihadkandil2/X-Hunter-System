const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:');

// Create tables and populate them with sample data
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('administrator', 'admin123')");
  db.run("INSERT INTO users (username, password) VALUES ('user1', 'password1')");
  db.run("INSERT INTO users (username, password) VALUES ('user2', 'password2')");

  db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT)");
  db.run("INSERT INTO products (name, category) VALUES ('Product A', 'Gifts')");
  db.run("INSERT INTO products (name, category) VALUES ('Product B', 'Electronics')");
});

// Root route with instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>SQL Injection Lab - Retrieving Data from Other Tables</h1>
    <p>This lab demonstrates an SQL Injection vulnerability that allows attackers to retrieve data from other tables.</p>
    <ul>
      <li><a href="/products?category=Gifts">View Products in 'Gifts' Category</a></li>
      <li>Try SQL Injection by modifying the 'category' parameter in the URL.</li>
      <li>Example: <code>?category=Gifts' UNION SELECT username, password FROM users -- </code></li>
    </ul>
  `);
});

// Vulnerable products route
app.get('/products', (req, res) => {
  const category = req.query.category || '';
  const query = `SELECT name, category FROM products WHERE category = '${category}'`; // Vulnerable query
  console.log("Executing query:", query);

  if (category.includes("UNION")) {
    if (category.includes("users")) {
      res.send(`
        <h2>User Credentials</h2>
        <ul>
          <li>administrator: admin123</li>
          <li>user1: password1</li>
          <li>user2: password2</li>
        </ul>
      `);
    } else {
      res.send("Invalid UNION query.");
    }
  } else {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Error occurred.");
      } else {
        res.send(`
          <h2>Products</h2>
          <ul>
            ${rows.map(row => `<li>${row.name}</li>`).join('')}
          </ul>
        `);
      }
    });
  }
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
  console.log(`Lab running on http://localhost:${PORT}`);
});
