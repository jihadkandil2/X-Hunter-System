const express = require('express');
const app = express();
const port = 3000;

// In-memory cache for demonstration
let cache = {};

// Home page route vulnerable to cache poisoning with strict cacheability criteria
app.get('/', (req, res) => {
  // Only cache if X-Cacheable header is "yes"
  const isCacheable = req.headers['x-cacheable'] === 'yes';
  // Default cache key
  let cacheKey = "default";
  // If the request has the X-Cache-Key header and is cacheable, use its value as the cache key
  if (isCacheable && req.headers['x-cache-key']) {
    cacheKey = req.headers['x-cache-key'];
  }
  
  // Check if cached response exists
  if (cache[cacheKey]) {
    return res.send(cache[cacheKey]);
  }
  
  // Build the HTML response. The injected value (cacheKey) is placed unsanitized inside a div.
  let content = `<html>
  <head>
    <title>Home Page</title>
  </head>
  <body>
    <h1>Welcome to our site!</h1>
    <div id="injection">Injected Value: ${cacheKey}</div>
  </body>
</html>`;
  
  // Only cache if criteria met
  if (isCacheable) {
    cache[cacheKey] = content;
  }
  
  res.send(content);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
