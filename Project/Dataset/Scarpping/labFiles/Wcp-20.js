const express = require('express');
const app = express();
const port = 3000;

let cachedContent = '<html><body><h1>Safe Page</h1></body></html>';

// Parameter cloaking vulnerability
app.get('/poison', (req, res) => {
  const utmSource = req.query.utm_source; // Used in cache key
  const utmContent = req.query.utm_content; // Ignored in cache key
  
  if(utmContent) {
    cachedContent = `<html><body>
      <h1>Hacked</h1>
      <script>${decodeURIComponent(utmContent)}</script>
    </body></html>`;
  }
  res.send(`Cache updated for source: ${utmSource}`);
});

app.get('/', (req, res) => {
  res.send(cachedContent);
});

app.listen(port, () => console.log('Server running: http://localhost:'+port));