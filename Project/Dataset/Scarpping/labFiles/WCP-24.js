const express = require('express');
const app = express();
const port = 3000;

let cachedContent = '<html><body><h1>Safe Content</h1></body></html>';

app.get('/update', (req, res) => {
  const geoHeader = req.header('X-Forwarded-For'); // Unkeyed header 1
  const userHeader = req.header('X-User-Type');    // Unkeyed header 2
  const payload = req.query.x;                     // Unkeyed parameter

  if (geoHeader && userHeader === 'premium' && payload) {
    cachedContent = `<html><body>
      <h1>Multi-Header Poisoning</h1>
      <script>${decodeURIComponent(payload)}</script>
    </body></html>`;
  }
  res.send(cachedContent);
});

app.get('/', (req, res) => {
  res.send(cachedContent);
});

app.listen(port, () => console.log('Server running: http://localhost:'+port));