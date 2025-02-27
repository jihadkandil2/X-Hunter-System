const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Simulated internal cache for the home page.
// Initially, the home page content is safe.
let homepageCache = {
  content: `<html>
  <head><title>Home</title></head>
  <body>
    <h1>Welcome to our website!</h1>
    <p>This content is served from our internal cache.</p>
  </body>
</html>`
};

// Vulnerable endpoint to poison the internal cache.
// An attacker can POST malicious HTML to update the cached home page.
app.post('/poison', (req, res) => {
  const maliciousContent = req.body.content;
  if (maliciousContent) {
    homepageCache.content = maliciousContent;
    res.send("Cache updated successfully.");
  } else {
    res.send("No content provided.");
  }
});

// Home page route that serves content from the internal cache.
app.get('/', (req, res) => {
  res.send(homepageCache.content);
});

// Instructions route to help the attacker/tester.
app.get('/instructions', (req, res) => {
  res.send(`
    <h1>Internal Cache Poisoning Lab</h1>
    <p>This lab is vulnerable to web cache poisoning through an internal cache used to serve the home page.</p>
    <p>To solve the lab, poison the internal cache so that when a victim (a Chrome user) visits the home page, it executes <code>alert(document.cookie)</code>.</p>
    <p>For example, send a POST request to <code>/poison</code> with the following JSON payload:</p>
    <pre>{ "content": "<html><head><title>Hacked</title></head><body><script>alert(document.cookie)</script></body></html>" }</pre>
    <p>After poisoning the cache, when the home page (<code>/</code>) is loaded in the victim's browser, the malicious script will execute.</p>
  `);
});

app.listen(port, () => {
  console.log(`Lab running on http://localhost:${port}`);
});
