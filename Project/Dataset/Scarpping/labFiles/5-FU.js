const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Configure session
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));

// Parse URL-encoded bodies (for login)
app.use(express.urlencoded({ extended: true }));

// Setup multer for file uploads in the "uploads" folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, uploadDir); },
    filename: (req, file, cb) => { cb(null, file.originalname); }
});
const upload = multer({ storage: storage });

// Home / Login route
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
    if (username === 'wiener' && password === 'peter') {
        req.session.loggedIn = true;
        res.redirect('/upload');
    } else {
        res.send('Invalid credentials.');
    }
});

// Upload page
app.get('/upload', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/');
    res.send(`
        <h2>Upload File</h2>
        <form method="POST" action="/upload" enctype="multipart/form-data">
            <input type="file" name="file" required />
            <button type="submit">Upload</button>
        </form>
        <p>Note: The upload function checks only the MIME type (Content-Type) provided by the client and accepts files only if it is exactly "image/png". Since this is user-controllable, an attacker can bypass it and upload a PHP web shell.</p>
    `);
});

// Handle file upload with vulnerable Content-Type check
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/');
    if (req.file.mimetype !== 'image/png') {
         return res.send('File type not allowed.');
    }
    res.send(`
       File uploaded successfully as ${req.file.originalname}.<br>
       <a href="/uploads/${encodeURIComponent(req.file.originalname)}">Access Uploaded File</a><br>
       <a href="/exec?file=${encodeURIComponent(req.file.originalname)}&cmd=cat%20secret.txt">Execute Shell</a>
    `);
});

// Serve static files from the uploads folder
app.use('/uploads', express.static(uploadDir));

// Vulnerable execution endpoint
// If the uploaded file's name contains ".php", it is treated as a PHP web shell and executed via the PHP interpreter.
app.get('/exec', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/');
    const file = req.query.file;
    const cmd = req.query.cmd || '';
    if (!file) return res.send('Missing file parameter.');
    const filePath = path.join(uploadDir, file);
    if (!fs.existsSync(filePath)) return res.send('File not found.');
    
    if (file.toLowerCase().includes('.php')) {
         // Adjust the path to php.exe as needed for your Windows installation
         const phpPath = 'C:\\php-8.4.4-nts-Win32-vs17-x64\\php.exe';
         const command = `"${phpPath}" "${filePath}" "${cmd}"`;
         exec(command, (error, stdout, stderr) => {
              if (error) {
                   return res.send(`Error executing shell: ${error.message}`);
              }
              res.send(`<pre>${stdout || stderr}</pre>`);
         });
    } else {
         res.send('Uploaded file is not a PHP shell.');
    }
});

// Secret endpoint (simulates /home/carlos/secret)
app.get('/secret', (req, res) => {
    const secretFile = path.join(__dirname, 'secret.txt');
    if (!fs.existsSync(secretFile)) {
         fs.writeFileSync(secretFile, 'SuperSecretData123', 'utf8');
    }
    const secret = fs.readFileSync(secretFile, 'utf8');
    res.send(`<pre>${secret}</pre>`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
