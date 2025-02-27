const express = require('express');
const cookieParser = require('cookie-parser');
const serialize = require('node-serialize');
const cookieSignature = require('cookie-signature');
const app = express();
const port = 3000;

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

app.use(cookieParser(SECRET_KEY));
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Server is running. Visit /session to trigger insecure deserialization from a signed cookie.');
});

// Debug route (for testing only)
app.get('/debug', (req, res) => {
  res.send(`SECRET_KEY: ${SECRET_KEY}`);
});

// Vulnerable route that reads a signed cookie "session" and unserializes it insecurely.
app.get('/session', (req, res) => {
  const sessionCookie = req.signedCookies.session;
  if (!sessionCookie) {
    return res.status(400).send('No valid signed session cookie found.');
  }
  try {
    // Insecure deserialization using node-serialize
    const sessionObj = serialize.unserialize(sessionCookie);
    res.send(`Welcome, ${sessionObj.username}! Your session is active.`);
  } catch (err) {
    res.status(400).send('Invalid session data.');
  }
});

// Utility route to generate a valid signed session cookie (for testing)
app.get('/generate-cookie', (req, res) => {
  // Serialize a benign session object (e.g., { username: "wiener" })
  const sessionData = serialize.serialize({ username: "wiener" });
  // Sign the session data using cookieSignature.sign; the output will be in the format "s:<signature>"
  const signedCookie = cookieSignature.sign(sessionData, SECRET_KEY);
  res.send(`Set this cookie in your browser as "session": ${signedCookie}`);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
