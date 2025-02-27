const express = require('express');
const app = express();

// Simulated user database
const users = [
  { id: 1, username: 'administrator', role: 'admin' },
  { id: 2, username: 'carlos', role: 'user' },
  { id: 3, username: 'wiener', role: 'user' }
];

// Vulnerable route: deletes a user based on the polluted URL parameter
app.delete('/api/users/:username', (req, res) => {
  const pollutedUsername = req.params.username;
  const targetUser = users.find(u => u.username === pollutedUsername);
  if (targetUser) {
    res.send(`User ${pollutedUsername} deleted.`);
  } else {
    res.status(404).send('User not found.');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
