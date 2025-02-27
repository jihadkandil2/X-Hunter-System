//SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:');

// Create a table and populate it with sample data
db.serialize(() => {
  db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, released INTEGER)");
  db.run("INSERT INTO products (name, category, released) VALUES ('Teddy Bear', 'Gifts', 1)");
  db.run("INSERT INTO products (name, category, released) VALUES ('Unreleased Puzzle', 'Gifts', 0)");
  db.run("INSERT INTO products (name, category, released) VALUES ('Smartphone', 'Electronics', 1)");
});

app.get('/', (req, res) => {
  res.send(`
    <form method="GET" action="/products">
      <label for="category">Category:</label>
      <input type="text" id="category" name="category">
      <button type="submit">Search</button>
    </form>
  `);
});

// Vulnerable route
app.get('/products', (req, res) => {
  const category = req.query.category; // Directly using user input without sanitization // vulnerability is here 
  const query = `SELECT * FROM products WHERE category = '${category}' AND released = 1`;

  console.log("Executing query:", query);
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send("Error executing query.");
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


