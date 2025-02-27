const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Session setup
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));

// Parse URL-encoded bodies (for login form)
app.use(express.urlencoded({ extended: true }));

// Setup multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// ----- ROUTES -----

// Home / Login page
app.get('/', (req, res) => {
  if (!req.session.loggedIn) {
    res.send(`
      <h2>Login</h2>
      <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    `);
  } else {
    res.redirect('/upload');
  }
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Credentials: wiener / peter
  if (username === 'wiener' && password === 'peter') {
    req.session.loggedIn = true;
    res.redirect('/upload');
  } else {
    res.send('Invalid credentials.');
  }
});

// Upload page (requires login)
app.get('/upload', (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/');
  res.send(`
    <h2>Upload File</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
    </form>
    <p>Note: Only image files (or .js files) are allowed. The check is very weak!</p>
  `);
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/');
  // Naively check file extension to simulate a weak image check.
  const ext = path.extname(req.file.originalname).toLowerCase();
  // Allow image types and .js (for our web shell)
  if (!['.jpg', '.jpeg', '.png', '.gif', '.js'].includes(ext)) {
    return res.send("File type not allowed.");
  }
  res.send(`File uploaded successfully as ${req.file.originalname}.<br>
    <a href="/uploads/${req.file.originalname}">Access Uploaded File</a>
    <br><a href="/shell?file=${encodeURIComponent(req.file.originalname)}&cmd=read">Execute Shell</a>
  `);
});

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

// Vulnerable shell execution endpoint
// If a .js file is uploaded, we "execute" it by requiring it.
// The uploaded shell must export a function that accepts a command and a callback.
app.get('/shell', (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/');
  const file = req.query.file;
  const cmd = req.query.cmd;
  if (!file || !cmd) return res.send("Missing file or cmd parameter.");
  const filePath = path.join(uploadDir, file);
  if (!fs.existsSync(filePath)) return res.send("Shell file not found.");
  if (path.extname(file) !== '.js') return res.send("Invalid shell file.");

  try {
    // Clear Node's require cache so we can re-run our uploaded shell file
    delete require.cache[require.resolve(filePath)];
    const shell = require(filePath);
    if (typeof shell !== 'function') return res.send("Uploaded shell is invalid.");
    // Call the shell function with the command.
    shell(cmd, (output) => {
      res.send(`<pre>${output}</pre>`);
    });
  } catch (err) {
    res.send("Error executing shell: " + err.toString());
  }
});

// Updated secret endpoint: Create a default secret.txt if not exists.
app.get('/secret', (req, res) => {
  const secretFile = path.join(__dirname, 'secret.txt');
  if (!fs.existsSync(secretFile)) {
    // Create secret.txt with a default secret.
    fs.writeFileSync(secretFile, 'SuperSecretData123', 'utf8');
  }
  const secret = fs.readFileSync(secretFile, 'utf8');
  res.send(`<pre>${secret}</pre>`);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
