const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
app.use(bodyParser.json());

// Add root route
app.get('/', (req, res) => {
  res.send(`
    <h1>Prototype Pollution Lab</h1>
    <h2>Login</h2>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <button>Login</button>
    </form>
    
    <h2>Admin Action</h2>
    <form onsubmit="sendAdminPayload(event)">
      <input type="text" id="payload" placeholder='{"__proto__": {...}}'>
      <button>Submit</button>
    </form>
    <script>
      function sendAdminPayload(e) {
        e.preventDefault();
        const payload = document.getElementById('payload').value;
        fetch('/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: JSON.parse(payload) })
        })
        .then(res => res.text())
        .then(data => alert(data));
      }
    </script>
  `);
});

// Rest of the code remains the same
// ... [keep the existing /admin, /login, and /debug endpoints] ...
// Vulnerable object merge function
const deepMerge = (target, source) => {
    for (const key in source) {
      if (typeof target[key] === 'object' && typeof source[key] === 'object') {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };
  
  // Admin functionality with prototype pollution vector
  app.post('/admin', (req, res) => {
    const userConfig = req.body.config || {};
    const baseConfig = {
      debugMode: false,
      privileges: ['read']
    };
  
    // Vulnerable merge
    const mergedConfig = deepMerge({}, baseConfig);
    deepMerge(mergedConfig, userConfig);
  
    // RCE vector through child_process
    const process = spawn('node', ['server.js'], {
      env: mergedConfig.environment || {}
    });
  
    process.stdout.on('data', (data) => {
      console.log(`Output: ${data}`);
    });
  
    res.send('Admin action performed');
  });
  
  // Login endpoint
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'wiener' && password === 'peter') {
      res.send('Logged in as admin');
    } else {
      res.status(401).send('Login failed');
    }
  });
  
  // Debug endpoint
  app.get('/debug', (req, res) => {
    res.json({
      nodeVersion: process.version,
      env: process.env
    });
  });
app.listen(3000, () => {
  console.log('Lab running on http://localhost:3000');
});