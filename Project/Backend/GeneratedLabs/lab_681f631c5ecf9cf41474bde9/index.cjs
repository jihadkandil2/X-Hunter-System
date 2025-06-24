const express = require('express');
const crypto = require('crypto');
const app = express();
let authCodes = {};
app.get('/oauth/authorize', (req, res) => {
  const challenge = req.query.code_challenge;
  const code = crypto.randomBytes(16).toString('hex');
  authCodes[code] = { challenge, valid: true };
  res.redirect(`${req.query.redirect_uri}?code=${code}`);
});
app.post('/oauth/token', (req, res) => {
  const { code } = req.body;
  if (authCodes[code]?.valid) {
    delete authCodes[code];
    return res.json({ access_token: 'LEAKED_TOKEN' });
  }
  res.status(400).json({ error: 'Invalid code' });
});
app.listen(4032);