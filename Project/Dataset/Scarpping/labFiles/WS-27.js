const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Simulated internal cache for the home page.
// The cache key is derived solely from the URL ("/"), ignoring any request body.
let homepageCache = {
  content: `<html>
  <head><title>Home</title></head>
  <body>
    <h1>Welcome to our website!</h1>
    <p>This is the safe cached content.</p>
  </body>
</html>`
};

// Vulnerable endpoint: update (poison) the cache via a GET request with a query parameter "poison"
app.get('/poison', (req, res) => {
  let maliciousContent = req.query.poison;
  if (maliciousContent) {
    // Decode the URL-encoded payload
    maliciousContent = decodeURIComponent(maliciousContent);
    homepageCache.content = maliciousContent;
    res.send("Cache poisoned successfully via query parameter.");
  } else {
    res.send("No poison payload provided.");
  }
});

// Additional testing form to let you submit the payload using your browser's developer tools or directly via a form.
app.get('/poison-form', (req, res) => {
  res.send(`
    <h1>Poison Cache Form</h1>
    <form method="GET" action="/poison">
      <label for="poison">Malicious Content (URL-encoded):</label><br>
      <input type="text" id="poison" name="poison" size="100" value="%3Chtml%3E%3Chead%3E%3Ctitle%3EHacked%3C%2Ftitle%3E%3Chead%3E%3Cbody%3E%3Cscript%3Ealert(1)%3C%2Fscript%3E%3C%2Fbody%3E%3C%2Fhtml%3E"><br><br>\n      <button type="submit">Poison Cache</button>\n    </form>\n  `);
});

// Home page route that serves content from the internal cache.
app.get('/', (req, res) => {
  res.send(homepageCache.content);
});

// Instructions route
app.get('/instructions', (req, res) => {
  res.send(`
    <h1>Fat GET Request Cache Poisoning Lab</h1>
    <p>This lab is vulnerable to web cache poisoning because the server accepts GET requests (even with a body, which many browsers ignore) and uses only the URL ("/") as the cache key.</p>
    <p>To solve the lab, poison the internal cache so that the home page executes <code>alert(1)</code> in the victim's browser.</p>
    <p>You can use the provided form at <a href="/poison-form">/poison-form</a> or directly send a GET request with the query parameter "poison".</p>\n    <p>For example, visit:\n    <code>http://localhost:3000/poison?poison=%3Chtml%3E%3Chead%3E%3Ctitle%3EHacked%3C%2Ftitle%3E%3Chead%3E%3Cbody%3E%3Cscript%3Ealert(1)%3C%2Fscript%3E%3C%2Fbody%3E%3C%2Fhtml%3E</code>\n    </p>\n  `);
});

app.listen(port, () => {
  console.log(`Lab running on http://localhost:${port}`);
});
