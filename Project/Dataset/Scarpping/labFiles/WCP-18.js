const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Simulated internal cache for the home page
let homepageCache = {
  content: `<html>
  <head><title>Home</title></head>
  <body>
    <h1>Welcome to our site</h1>
    <p>Normal content here.</p>
  </body>
</html>`
};

// Vulnerable endpoint: update the cached homepage content with unsanitized input.
// The cache normalization process is simulated by URL-decoding the provided input.
app.post('/poison', (req, res) => {
  const { input } = req.body;
  if (input) {
    // Simulate cache normalization: decode URL-encoded input before caching
    homepageCache.content = `<html>
  <head><title>Home</title></head>
  <body>
    <h1>Welcome to our site</h1>
    <p>${decodeURIComponent(input)}</p>
  </body>
</html>`;
    res.send("Cache updated successfully.");
  } else {
    res.send("No input provided.");
  }
});

// Home page route that serves content from the internal cache.
app.get('/', (req, res) => {
  res.send(homepageCache.content);
});

// Instructions route
app.get('/instructions', (req, res) => {
  res.send(`
    <h1>URL Normalization Lab</h1>
    <p>This lab contains an XSS vulnerability that is normally not directly exploitable because the browser URL-encodes the injected payload.</p>
    <p>To solve the lab, poison the internal cache by sending a specially crafted payload that, after URL normalization (i.e. URL-decoding), injects an XSS payload.</p>
    <p>For example, send a POST request to <code>/poison</code> with the following JSON payload:</p>
    <pre>{ "input": "Hello%3Cscript%3Ealert(1)%3C/script%3E" }</pre>
    <p>Then, when a victim’s browser (e.g. Chrome) requests the home page (<code>/</code>) with the normalized value, it will execute <code>alert(1)</code>.</p>
  `);
});

app.listen(port, () => {
  console.log(`Lab running on http://localhost:${port}`);
});
