const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Directory containing key files (e.g., "rs256.pem" for normal tokens)
const keysDir = path.join(__dirname, 'keys');

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Simulated user database
const users = {
  wiener: { password: 'peter', role: 'user' },
  carlos: { password: 'secret', role: 'admin' }
};

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
// Signs token with RS256 using the private key located at keysDir/rs256.pem
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    const privateKey = fs.readFileSync(path.join(keysDir, 'rs256.pem'), 'utf8');
    // Token header includes kid set to "rs256" (normal behavior)
    const token = jwt.sign(
      { username, role: users[username].role },
      privateKey,
      { algorithm: 'RS256', header: { kid: 'rs256' } }
    );
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Vulnerable Admin route
// Uses the "kid" value from the token header to load the key file without sanitization.
app.get('/admin', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // Decode token header to extract kid value
    const decodedHeader = jwt.decode(token, { complete: true }).header;
    let kid = decodedHeader.kid; // Vulnerable: unsanitized input!
    
    // Vulnerable path traversal: the kid value is used directly in the file path.
    let keyPath = path.join(keysDir, kid + '.pem');
    const keyData = fs.readFileSync(keyPath, 'utf8');

    // Verify the token using the key loaded from the file system.
    const decoded = jwt.verify(token, keyData);
    if (decoded.role === 'admin') return res.json({ message: 'Welcome, admin!' });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
  res.status(403).json({ error: 'Access denied' });
});

// Admin delete route (requires a valid admin token)
app.post('/admin/deleteUser', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decodedHeader = jwt.decode(token, { complete: true }).header;
    let kid = decodedHeader.kid;
    let keyPath = path.join(keysDir, kid + '.pem');
    const keyData = fs.readFileSync(keyPath, 'utf8');
    
    const decoded = jwt.verify(token, keyData);
    if (decoded.role === 'admin') {
      const { username } = req.body;
      if (username && username === 'carlos') {
        return res.json({ message: `User ${username} deleted` });
      }
      return res.status(400).json({ error: 'Invalid username' });
    }
    return res.status(403).json({ error: 'Access denied' });
  } catch(err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
});

app.listen(port, () => {
  console.log(`Lab running on http://localhost:${port}`);
});
