const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// 1) Define the safe directory (where files are normally executed)
const safeDir = path.join(__dirname, 'safe');
if (!fs.existsSync(safeDir)) {
    fs.mkdirSync(safeDir);
}

// 2) Configure session
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));

// 3) Parse URL-encoded bodies (for login form)
app.use(express.urlencoded({ extended: true }));

// 4) Setup multer for file uploads (store files in the uploads folder)
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

// 5) Home / Login route
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

// 6) Login handler
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Hard-coded credentials: wiener / peter
    if (username === 'wiener' && password === 'peter') {
        req.session.loggedIn = true;
        res.redirect('/upload');
    } else {
        res.send('Invalid credentials.');
    }
});

// 7) Upload page
app.get('/upload', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/');
    res.send(`
        <h2>Upload File</h2>
        <form method="POST" action="/upload" enctype="multipart/form-data">
            <input type="file" name="file" required />
            <button type="submit">Upload</button>
        </form>
        <p>This lab simulates a path traversal vulnerability that bypasses the safe directory restriction.</p>
        <p>Tip: Rename your PHP web shell (e.g., shell.php) to shell.php.jpg to bypass the blacklist.</p>
    `);
});

// 8) Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/');
    const filename = req.file.originalname;
    // Basic blacklist check based on last extension
    const dangerousExtensions = ['phtml', 'php3', 'php4', 'php5', 'phps'];
    const ext = path.extname(filename).toLowerCase().slice(1); // remove dot
    if (dangerousExtensions.includes(ext)) {
        return res.send('File type not allowed.');
    }
    res.send(`
        File uploaded successfully as ${filename}.<br>
        <a href="/uploads/${encodeURIComponent(filename)}">Access Uploaded File</a><br>
        <a href="/exec?file=${encodeURIComponent(filename)}&cmd=type%20secret.txt">Execute Shell</a>
    `);
});

// 9) Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

// 10) Vulnerable execution endpoint (with path traversal)
// This endpoint copies the uploaded file from uploads to the safe directory under a .php name and then executes it.
app.get('/exec', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/');
    const fileParam = req.query.file; // e.g. ../../uploads/shell.php.jpg
    const cmd = req.query.cmd || '';  // e.g. type secret.txt
    if (!fileParam) return res.send('Missing file parameter.');

    // Resolve the original file path in uploads
    const filePath = path.join(uploadDir, fileParam);
    if (!fs.existsSync(filePath)) return res.send('File not found.');

    // Copy the file into the safe directory with a proper .php extension
    const safeFilePath = path.join(safeDir, 'shell_temp.php');
    try {
        fs.copyFileSync(filePath, safeFilePath);
    } catch (err) {
        return res.send('Error copying file to safe directory: ' + err.toString());
    }

    // Define full path to php.exe (adjust if necessary)
    const phpPath = 'C:\\php-8.4.4-nts-Win32-vs17-x64\\php.exe';
    const command = `"${phpPath}" "${safeFilePath}" "${cmd}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.send(`Error executing shell: ${error.message}`);
        }
        res.send(`<pre>${stdout || stderr}</pre>`);
    });
});

// 11) Secret endpoint: simulates /home/carlos/secret
app.get('/secret', (req, res) => {
    const secretFile = path.join(__dirname, 'secret.txt');
    if (!fs.existsSync(secretFile)) {
        fs.writeFileSync(secretFile, 'SuperSecretData123', 'utf8');
    }
    const secret = fs.readFileSync(secretFile, 'utf8');
    res.send(`<pre>${secret}</pre>`);
});

// 12) Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
