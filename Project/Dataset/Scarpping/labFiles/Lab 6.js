const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Simulating Oracle-like database
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:');

// Create tables and populate them with sample data
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('administrator', 'admin123')");
  db.run("INSERT INTO users (username, password) VALUES ('user1', 'user123')");
  db.run("INSERT INTO users (username, password) VALUES ('user2', 'user456')");

  db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT)");
  db.run("INSERT INTO products (name, category) VALUES ('Product 1', 'Gifts')");
  db.run("INSERT INTO products (name, category) VALUES ('Product 2', 'Electronics')");
});

// Root route for instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>SQL Injection Lab - Oracle</h1>
    <p>This lab demonstrates SQL Injection vulnerability allowing enumeration and extraction of database contents.</p>
    <ul>
      <li><a href="/products?category=Gifts">View Products in 'Gifts' Category</a></li>
      <li>Inject queries to enumerate database schema and retrieve user credentials.</li>
    </ul>
  `);
});

// Vulnerable products route
app.get('/products', (req, res) => {
  const category = req.query.category || '';
  const query = `SELECT * FROM products WHERE category = '${category}'`;
  console.log("Executing query:", query);

  if (category.includes("UNION")) {
    if (category.includes("sqlite_master")) {
      res.send(`
        <h2>Database Schema</h2>
        <ul>
          <li>users: id, username, password</li>
          <li>products: id, name, category</li>
        </ul>
      `);
    } else if (category.includes("users")) {
      res.send(`
        <h2>User Credentials</h2>
        <ul>
          <li>administrator: admin123</li>
          <li>user1: user123</li>
          <li>user2: user456</li>
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
