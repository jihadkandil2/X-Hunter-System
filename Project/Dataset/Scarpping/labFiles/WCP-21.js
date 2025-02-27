const express = require('express');
const app = express();
const port = 3000;

let cachedPage = '<html><body><h1>Safe Content</h1></body></html>';

// Vulnerable endpoint - "lang" is cached, "payload" is unkeyed
app.get('/update', (req, res) => {
  const lang = req.query.lang; // Part of cache key
  const payload = req.query.payload; // Ignored in cache key
  
  if(payload) {
    cachedPage = `<html><body>
      <h1>Cache Poisoning Lab</h1>
      <script>${decodeURIComponent(payload)}</script>
    </body></html>`;
  }
  res.send(`Cache updated for language: ${lang}`);
});

// Homepage with cached content
app.get('/', (req, res) => {
  res.send(cachedPage);
});

app.listen(port, () => console.log('Server running: http://localhost:'+port));