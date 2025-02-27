const express = require('express');
const serialize = require('node-serialize');
const app = express();
const port = 3000;

app.use(express.json());

// Vulnerable session endpoint using insecure deserialization
app.post('/session', (req, res) => {
  const serializedData = req.body.session;
  try {
    // Insecure deserialization: directly unserialize the provided session data
    const sessionObj = serialize.unserialize(serializedData);
    res.send(`Welcome, ${sessionObj.username}! Your session is active.`);
  } catch (err) {
    res.status(400).send('Invalid session data.');
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Server is running. Use POST /session to test insecure deserialization.');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
