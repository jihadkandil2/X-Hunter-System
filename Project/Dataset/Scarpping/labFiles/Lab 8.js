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

// Root route for instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>SQL Injection Lab - Find Text-Compatible Column</h1>
    <p>This lab demonstrates SQL Injection vulnerability to identify string-compatible columns using UNION attacks.</p>
    <ul>
      <li><a href="/products?category=Gifts">View Products in 'Gifts' Category</a></li>
      <li>Try SQL Injection by modifying the 'category' parameter in the URL.</li>
      <li>Example: <code>?category=Gifts' UNION SELECT NULL, 'test' -- </code></li>
    </ul>
  `);
});

// Vulnerable products route
app.get('/products', (req, res) => {
  const category = req.query.category || '';
  const query = `SELECT * FROM products WHERE category = '${category}'`; // Vulnerable query
  console.log("Executing query:", query);

  // Handle UNION injection detection
  if (category.includes("UNION")) {
    const testValue = "test_string"; // Simulated test value to inject
    if (category.includes("NULL, 'test_string'")) {
      res.send(`
        <h2>Column Compatibility</h2>
        <p>The second column ('name') is compatible with string data.</p>
      `);
    } else {
      res.send(`
        <h2>Invalid Injection</h2>
        <p>Ensure your UNION attack is formatted correctly.</p>
      `);
    }
  } else {
    // Normal query execution
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
