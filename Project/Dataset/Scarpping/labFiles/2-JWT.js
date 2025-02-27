const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Load RSA key pair (private key used for signing, public key for verification)
const privateKey = fs.readFileSync('private.key', 'utf8');
const publicKey = fs.readFileSync('public.key', 'utf8');

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

// Simulated user database
const users = {
  wiener: { password: 'peter', role: 'user' },
  carlos: { password: 'secret', role: 'admin' }
};

// Expose the public key via a standard endpoint (for the lab challenge)
app.get('/publicKey', (req, res) => {
  res.type('text/plain').send(publicKey);
});

// Serve login page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>JWT Authentication</h2>
        <form action="/login" method="POST">
          <input type="text" name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});

// Login route (returns a JWT token)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    // Sign token using RS256 with the private key
    const token = jwt.sign({ username, role: users[username].role }, privateKey, { algorithm: 'RS256' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Admin route (protected by JWT)
// Vulnerability: the verification does not restrict the algorithm, so HS256 tokens signed with the public key may be accepted.
app.get('/admin', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, publicKey); // Note: No algorithm restrictions here!
    if (decoded.role === 'admin') return res.json({ message: 'Welcome, admin!' });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
  res.status(403).json({ error: 'Access denied' });
});

// Admin delete route (requires valid admin token)
app.post('/admin/deleteUser', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, publicKey);
    if (decoded.role === 'admin') {
      const { username } = req.body;
      if (username && username === "carlos") {
        // Simulate deletion of user "carlos"
        return res.json({ message: `User ${username} deleted` });
      }
      return res.status(400).json({ error: 'Invalid username' });
    }
    return res.status(403).json({ error: 'Access denied' });
  } catch(err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Lab running on http://localhost:${port}`);
});
