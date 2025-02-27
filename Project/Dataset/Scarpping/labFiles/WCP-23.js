const express = require('express');
const app = express();
const port = 3000;

// Add this basic route handler
app.get('/', (req, res) => {
  res.send('Home page - visit /comments');
});

// Rest of your existing code
let cachedResponse = '<html><body><div id="comments"></div></body></html>';

app.get('/comments', (req, res) => {
  const userGroup = req.header('X-User-Group');
  const payload = req.query.payload;

  if(userGroup === 'premium' && payload) {
    cachedResponse = `<html><body>
      <div id="comments">
        <script>${decodeURIComponent(payload)}</script>
      </div>
    </body></html>`;
  }
  res.send(cachedResponse);
});

app.listen(port, () => console.log('Server running: http://localhost:'+port));