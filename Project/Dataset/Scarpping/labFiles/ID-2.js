const express = require('express');
const app = express();

// Debug endpoint that discloses the SECRET_KEY environment variable
app.get('/debug', (req, res) => {
  const secretKey = process.env.SECRET_KEY || 'default_secret';
  res.send(`SECRET_KEY: ${secretKey}`);
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Debug Information Disclosure Lab</h1>
    <p>This lab contains a debug page that discloses sensitive information about the application.</p>
    <p>To solve the lab, obtain and submit the SECRET_KEY environment variable.</p>
    <p>Access the debug page at: <a href="/debug">/debug</a></p>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
