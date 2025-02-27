const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Simulated vulnerable cache
let homepageCache = {
  content: `<html>
  <head><title>Home</title></head>
  <body>
    <h1>Welcome!</h1>
    <p>Safe content</p>
  </body>
</html>`
};

// Cache poisoning endpoint (GET with query param fallback)
app.get('/poison', (req, res) => {
  const payload = req.query.poison;
  if (payload) {
    homepageCache.content = decodeURIComponent(payload);
    res.send("Cache poisoned!");
  } else {
    res.send("Add ?poison=PAYLOAD");
  }
});

// Homepage with cached content
app.get('/', (req, res) => {
  res.send(homepageCache.content);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});