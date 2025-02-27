const express = require('express');
const path = require('path');

const app = express();

// Vulnerable route: Exposes backup source code from a hidden directory
app.get('/.backup/code.txt', (req, res) => {
  // Simulated leaked source code that contains a hard-coded database password
  const leakedSource = `
    // Backup source code file
    const dbPassword = 'supersecret'; // The database password
    function connectDatabase() {
      // connection logic here...
    }
    module.exports = { connectDatabase };
  `;
  res.type('text/plain');
  res.send(leakedSource);
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Information Disclosure Lab</h1>
    <p>This lab leaks its source code via backup files in a hidden directory.</p>
    <p>To solve the lab, identify and submit the database password hard-coded in the leaked source code.</p>
    <p>Try accessing the backup file at: <a href="/.backup/code.txt">/.backup/code.txt</a></p>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
