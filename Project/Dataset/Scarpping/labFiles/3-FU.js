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
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Home/Login route
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
        <p>Note: This upload function blacklists dangerous file extensions based only on the last extension. This defense can be bypassed (for example, by renaming a dangerous file to <code>shell.js.jpg</code> and then renaming it to a .js file upon execution). In this lab, you should upload a JavaScript web shell.</p>
    `);
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/');
    const filename = req.file.originalname;
    // Blacklist check: reject files with these dangerous extensions (based on the last extension)
    const dangerousExtensions = ['php', 'phtml', 'php3', 'php4', 'php5', 'phps'];
    let ext = path.extname(filename).toLowerCase().slice(1); // Remove the dot
    if (dangerousExtensions.includes(ext)) {
        return res.send('File type not allowed.');
    }
    res.send(`File uploaded successfully as ${filename}.<br>
        <a href="/uploads/${encodeURIComponent(filename)}">Access Uploaded File</a><br>
        <a href="/exec?file=${encodeURIComponent(filename)}&cmd=read">Execute Shell</a>
    `);
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

// Vulnerable execution endpoint (JS Shell Only)
// This endpoint executes the uploaded JavaScript shell file using Node's require() function.
app.get('/exec', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/');
    const file = req.query.file;
    const cmd = req.query.cmd || '';
    if (!file) return res.send('Missing file parameter.');
    const filePath = path.join(uploadDir, file);
    if (!fs.existsSync(filePath)) return res.send('File not found.');
    
    // Only support JavaScript shell files based on the extension
    if (path.extname(file).toLowerCase() !== '.js') {
        return res.send('Unsupported shell file type. Only JavaScript shells are supported.');
    }
    
    try {
        // Clear Node's require cache so we can re-run the uploaded shell file
        delete require.cache[require.resolve(filePath)];
        const shell = require(filePath);
        if (typeof shell !== 'function') return res.send('Uploaded JS shell is invalid.');
        // Call the shell function with the provided command
        shell(cmd, (output) => {
            res.send(`<pre>${output}</pre>`);
        });
    } catch (err) {
        res.send("Error executing JS shell: " + err.toString());
    }
});

// Secret endpoint: simulates the secret file located at /home/carlos/secret
// The secret is stored in secret.txt in the same directory as app.js.
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
