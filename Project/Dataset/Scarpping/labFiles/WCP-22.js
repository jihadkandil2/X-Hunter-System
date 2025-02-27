const express = require('express');
const app = express();
const port = 3000;

let cachedResponse = '<html><body><h1>Safe Content</h1></body></html>';

// Cache ignores all query parameters
app.get('/poison', (req, res) => {
  const payload = req.query.x; // Unkeyed parameter
  
  if(payload) {
    cachedResponse = `<html><body>
      <h1>Unkeyed Query Lab</h1>
      <script>${decodeURIComponent(payload)}</script>
    </body></html>`;
  }
  res.send('Cache updated');
});

// Homepage with unkeyed query caching
app.get('/', (req, res) => {
  res.send(cachedResponse);
});

app.listen(port, () => console.log('Server running: http://localhost:'+port));