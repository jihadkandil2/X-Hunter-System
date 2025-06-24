const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();
app.get('/verify-token', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, { complete: true });
  const keyPath = `/keys/${decoded.header.kid}`;
  const pubKey = fs.readFileSync(keyPath);
  try {
    const payload = jwt.verify(token, pubKey);
    res.json({ valid: true, user: payload.user });
  } catch (e) {
    res.status(403).json({ error: 'Invalid token' });
  }
});
app.listen(4572);