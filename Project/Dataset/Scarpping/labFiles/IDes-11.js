const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Setup session middleware (simulating a PHP serialization-based session mechanism)
app.use(session({
  secret: 'insecure_deserialization_secret',
  resave: false,
  saveUninitialized: true
}));

// Setup a simulated "Carlos home" directory with a morale.txt file
const carlosHome = path.join(__dirname, 'carlos_home');
if (!fs.existsSync(carlosHome)) {
  fs.mkdirSync(carlosHome);
}
const moraleFile = path.join(carlosHome, 'morale.txt');
if (!fs.existsSync(moraleFile)) {
  fs.writeFileSync(moraleFile, 'Morale text content');
}

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Arbitrary Object Injection Lab</h1>
    <p>This lab uses a serialization-based session mechanism and is vulnerable to arbitrary object injection due to insecure deserialization.</p>
    <p>To solve the lab, create and inject a malicious serialized object that deletes the <code>morale.txt</code> file from Carlos's home directory.</p>
    <p>Log in using credentials: <strong>wiener</strong> / <strong>peter</strong>.</p>
    <p><a href="/login">Login Here</a></p>
  `);
});

// Login page route
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username"><br><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password"><br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Login endpoint – valid credentials: wiener / peter
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'wiener' && password === 'peter') {
    // Create a serialized session object with a default safe command
    const sessionData = JSON.stringify({ user: username, command: "echo Safe" });
    // Set the cookie (unsigned, so it can be modified by the client)
    res.cookie("sessionData", sessionData, { httpOnly: false });
    res.send(`Logged in as ${username}. <a href="/process-session">Process Session</a>`);
  } else {
    res.send("Invalid credentials.");
  }
});

// GET route for /process-session: display a form for payload submission (optional)
app.get('/process-session', (req, res) => {
  if (!req.cookies.sessionData) {
    return res.send("No session data found. Please log in.");
  }
  res.send(`
    <h1>Session Data Deserialization</h1>
    <p>Your current session cookie (modifiable):</p>
    <pre>${req.cookies.sessionData}</pre>
    <p>You can modify this cookie using your browser's developer tools and then revisit this page to trigger the vulnerable deserialization.</p>
    <p><a href="/deserialize">Submit Modified Session Data</a></p>
  `);
});

// GET route for /deserialize: display a form for payload submission
app.get('/deserialize', (req, res) => {
  if (!req.cookies.sessionData) {
    return res.send("Please log in first.");
  }
  res.send(`
    <h1>Submit Deserialization Payload</h1>
    <form method="POST" action="/deserialize">
      <label for="payload">Payload (raw serialized object):</label><br><br>
      <textarea id="payload" name="payload" rows="6" cols="50" placeholder='{ "command": "echo Exploit executed" }'></textarea><br><br>
      <button type="submit">Submit Payload</button>
    </form>
  `);
});

// Vulnerable endpoint: insecure deserialization using eval (simulation only!)
app.post('/deserialize', (req, res) => {
  if (!req.cookies.sessionData) {
    return res.send("Please log in first.");
  }
  const payload = req.body.payload;
  try {
    // WARNING: Using eval to deserialize user input is dangerous and used here for lab simulation only!
    const deserialized = eval('(' + payload + ')');
    if (deserialized && deserialized.command) {
      exec(deserialized.command, (error, stdout, stderr) => {
        if (error) {
          console.error("Error executing command:", error.message);
          return res.status(500).send("Command execution error: " + error.message);
        }
        res.send(`Command executed successfully: ${stdout}`);
      });
    } else {
      res.send("No command found in payload.");
    }
  } catch (e) {
    res.send("Deserialization error: " + e.message);
  }
});

app.listen(port, () => {
  console.log(`Lab running on http://localhost:${port}`);
});
