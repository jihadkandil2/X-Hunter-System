const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Simulated MongoDB "database"
const users = [
  { username: 'administrator', password: 'admin123' },
  { username: 'wiener', password: 'peter' }
];

// Root route to prevent "Cannot GET /" error
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the NoSQL Injection Lab</h1><p>Use the <code>/login</code> endpoint with a POST request.</p>');
});

// Vulnerable login route: NoSQL Injection
app.post('/login', (req, res) => {
  let query = req.body;
  
  let user = users.find(u => {
    return Object.keys(query).every(key => {
      if (typeof query[key] === 'object' && query[key].$ne !== undefined) {
        return u[key] != query[key].$ne;
      } else {
        return u[key] === query[key];
      }
    });
  });

  if (user) {
    res.send(`Welcome, ${user.username}!`);
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
