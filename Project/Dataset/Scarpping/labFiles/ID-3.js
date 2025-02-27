const express = require('express');
const app = express();

// Endpoint that intentionally triggers an error with a verbose message
app.get('/error', (req, res, next) => {
  // Simulate an error that discloses a vulnerable framework version
  const error = new Error("Vulnerable framework detected: VulnerableFramework v1.2.3");
  next(error);
});

// Error-handling middleware to display verbose error messages
app.use((err, req, res, next) => {
  res.status(500).send(`
    <h1>Error Occurred</h1>
    <pre>${err.stack}</pre>
  `);
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Information Disclosure via Error Messages Lab</h1>
    <p>This lab intentionally triggers a verbose error message that reveals the version number of a vulnerable third-party framework.</p>
    <p>To solve the lab, visit the error page at <code>/error</code> and extract the framework version from the error message.</p>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
