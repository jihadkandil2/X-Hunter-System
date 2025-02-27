const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:');

// Create a table and populate it with sample data
db.serialize(() => {
  db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT)");
  db.run("INSERT INTO products (name, category) VALUES ('Item 1', 'Gifts')");
  db.run("INSERT INTO products (name, category) VALUES ('Item 2', 'Electronics')");
});

// Root route for instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>SQL Injection Lab</h1>
    <p>This lab demonstrates an SQL Injection vulnerability in the product category filter.</p>
    <ul>
      <li><a href="/products?category=Gifts">View Products in 'Gifts' Category</a></li>
      <li>Try SQL Injection by modifying the 'category' parameter in the URL.</li>
      <li>Example: <code>?category=Gifts' UNION SELECT 'SQLite 3.32.3' AS name --</code></li>
      <li><a href="/database-info">Simulated Database Info</a></li>
    </ul>
  `);
});

// Vulnerable route simulating SQL injection vulnerability
app.get('/products', (req, res) => {
  const category = req.query.category || ''; // Safeguard to prevent null category
  const query = `SELECT * FROM products WHERE category = '${category}'`; // Vulnerable query
  console.log("Executing query:", query);

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err.message);
      res.status(500).send("Error occurred during query execution.");
    } else {
      res.send(`
        <h2>Products</h2>
        <ul>
          ${rows.map(row => `<li>${row.name}</li>`).join('')}
        </ul>
      `);
    }
  });
});

// Simulate database information retrieval for UNION-based injection
app.get('/database-info', (req, res) => {
  // Static response to simulate UNION attack
  const simulatedResponse = [
    { version: 'SQLite 3.32.3' },
    { version: 'Oracle 19c' }
  ];
  res.json(simulatedResponse);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
