const express = require('express');
const app = express();
const port = 3000;

// In-memory cache for demonstration purposes
let cache = {};

// Home page route vulnerable to cache poisoning
app.get('/', (req, res) => {
  // Use the Accept-Language header to simulate the victim's language (default to "en")
  const lang = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'en';
  
  // Construct a cache key based on the language
  let cacheKey = "home_" + lang;
  
  // If an attacker provides a custom header "x-cache-key", use that instead (vulnerable behavior)
  if (req.headers['x-cache-key']) {
    cacheKey = req.headers['x-cache-key'];
  }
  
  // Check if the page is cached
  if (cache[cacheKey]) {
    return res.send(cache[cacheKey]);
  }
  
  // Build the HTML content, including the cacheKey unsanitized
  let content = `<html>
  <body>
    <h1>Welcome to the Home Page</h1>
    <p>Your language is set to: ${lang}</p>
    <p>Cache key: ${cacheKey}</p>
  </body>
</html>`;
  
  // Cache the content using the constructed key
  cache[cacheKey] = content;
  res.send(content);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
