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
    <h1>SQL Injection Lab - Determine Columns</h1>
    <p>This lab demonstrates SQL Injection vulnerability for determining the number of columns.</p>
    <ul>
      <li><a href="/products?category=Gifts">View Products in 'Gifts' Category</a></li>
      <li>Inject queries to determine the number of columns returned.</li>
    </ul>
  `);
});

// Vulnerable route for products
app.get('/products', (req, res) => {
  const category = req.query.category || '';
  const query = `SELECT * FROM products WHERE category = '${category}'`;
  console.log("Executing query:", query);

  if (category.includes("UNION")) {
    res.send(`
      <h2>Column Count</h2>
      <p>The query returns 2 columns: id, name.</p>
    `);
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
