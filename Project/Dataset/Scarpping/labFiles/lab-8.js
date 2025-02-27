const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Setup a simulated "Carlos home" directory with a morale.txt file
const carlosHome = path.join(__dirname, 'carlos_home');
if (!fs.existsSync(carlosHome)) {
  fs.mkdirSync(carlosHome);
}
const moralePath = path.join(carlosHome, 'morale.txt');
fs.writeFileSync(moralePath, 'Morale text content');

// Vulnerable API endpoint that executes OS commands unsanitized
app.post('/api/execute', (req, res) => {
  const command = req.body.command; // unsanitized input
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return res.status(500).send(`Error: ${error.message}`);
    }
    res.send(`Command executed successfully: ${stdout}`);
  });
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>OS Command Injection Lab via LLM APIs</h1>
    <p>This lab contains an OS command injection vulnerability in the API endpoint.</p>
    <p>To solve the lab, delete the morale.txt file from Carlos' home directory.</p>
    <p>Send a POST request to <code>/api/execute</code> with a command payload.</p>
    <p>Example payload: <code>rm ${moralePath}</code></p>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
