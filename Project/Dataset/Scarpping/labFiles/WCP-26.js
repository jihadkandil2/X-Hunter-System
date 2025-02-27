const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

app.use(cookieParser());
let cachedPage = '<html><body><h1>Safe Page</h1></body></html>';

app.get('/', (req, res) => {
  const payload = req.cookies.payload; // Unkeyed cookie
  
  if (payload) {
    cachedPage = `<html><body>
      <h1>Cookie Cache Poisoning</h1>
      <script>${decodeURIComponent(payload)}</script>
    </body></html>`;
  }
  res.send(cachedPage);
});

app.listen(port, () => console.log('Server running: http://localhost:'+port));