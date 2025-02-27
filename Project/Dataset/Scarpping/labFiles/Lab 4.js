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
  db.run("INSERT INTO products (name, category) VALUES ('Product 1', 'Gifts')");
  db.run("INSERT INTO products (name, category) VALUES ('Product 2', 'Electronics')");
});

// Root route with instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>SQL Injection Lab</h1>
    <p>This lab demonstrates an SQL Injection vulnerability in the product category filter.</p>
    <ul>
      <li><a href="/products?category=Gifts">View Products in 'Gifts' Category</a></li>
      <li>Try SQL Injection by modifying the 'category' parameter in the URL.</li>
      <li>Example: <code>?category=Gifts' UNION SELECT 'MySQL 8.0.28', 'MySQL' -- </code></li>
      <li>Example: <code>?category=Gifts' UNION SELECT 'Microsoft SQL Server 2019', 'SQL Server' -- </code></li>
      <li><a href="/database-info">Simulated Database Info</a></li>
    </ul>
  `);
});

// Vulnerable route for products
app.get('/products', (req, res) => {
  const category = req.query.category || ''; // Safeguard against null category
  const query = `SELECT * FROM products WHERE category = '${category}'`; // Vulnerable query
  console.log("Executing query:", query);

  if (category.includes("UNION")) {
    // Simulate UNION query output
    res.send(`
      <h2>Products</h2>
      <ul>
        <li>MySQL 8.0.28</li>
        <li>Microsoft SQL Server 2019</li>
      </ul>
    `);
  } else {
    // Normal query execution
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
  }
});

// Simulated database info for UNION-based injection
app.get('/database-info', (req, res) => {
  // Static response to mimic UNION injection output for database versions
  const simulatedResponse = [
    { version: 'MySQL 8.0.28', db: 'MySQL' },
    { version: 'Microsoft SQL Server 2019', db: 'SQL Server' }
  ];
  res.json(simulatedResponse);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
