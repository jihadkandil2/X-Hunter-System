const express = require('express');
const app = express();
const port = 3000;

// Middleware to simulate authentication
app.use((req, res, next) => {
    req.user = { username: 'wiener' }; // Simulated logged-in user
    next();
});

// Route to serve the debug page
app.get('/debug', (req, res) => {
    if (req.user && req.user.username === 'wiener') {
        res.send(`
            <h1>Debug Page</h1>
            <p>SECRET_KEY: ${process.env.SECRET_KEY}</p>
        `);
    } else {
        res.status(403).send('Forbidden');
    }
});

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Express App!');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
