const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Server is running. Try accessing /debug to view the SECRET_KEY.');
});

// Route to display the SECRET_KEY
app.get('/debug', (req, res) => {
  const secretKey = process.env.SECRET_KEY || 'SECRET_KEY not set';
  res.send(`SECRET_KEY: ${secretKey}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
