const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.head('/api/user', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, { complete: true });
  res.set('X-User-Data', JSON.stringify(decoded.payload));
  res.end();
});
app.get('/api/user', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    res.json(decoded);
  });
});
app.listen(4471);