const express = require('express');
const app = express();
const port = 3000;

// In-memory cache (for demonstration purposes)
let cache = {};

// Home page route vulnerable to cache key injection
app.get('/', (req, res) => {
  // Check for the "Pragma" header that contains the injection string
  let pragmaHeader = req.headers['pragma'];
  // Use a default cache key if the header is not present or doesn't include our marker
  let cacheKey = "default";
  
  if (pragmaHeader && pragmaHeader.includes('x-get-cache-key')) {
    // Use the entire header value as the cache key (vulnerable)
    cacheKey = pragmaHeader;
  }
  
  // Check if a cached version exists for this key
  if (cache[cacheKey]) {
    return res.send(cache[cacheKey]);
  }
  
  // Build HTML content unsafely including the cacheKey
  let content = `<html>
  <body>
    <h1>Welcome to the Site</h1>
    <p>Your cache key is: ${cacheKey}</p>
  </body>
</html>`;
  
  // Cache the generated content using the vulnerable cache key
  cache[cacheKey] = content;
  res.send(content);
});
app.get('/clear-cache', (req, res) => {
    cache = {};
    res.send('Cache cleared.');
  });
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
