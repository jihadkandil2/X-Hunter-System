const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/nosql_extract', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: String
});
const User = mongoose.model('User', UserSchema);

// Database Initialization
async function initializeDB() {
  await User.deleteMany({});
  await User.create([
    { username: 'administrator', password: 'p@ssw0rd!SECRET123', role: 'admin' },
    { username: 'carlos', password: 'qwertyuiop', role: 'user' },
    { username: 'wiener', password: 'peter', role: 'user' }
  ]);
}
initializeDB();

// Exploitable Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  User.findOne({
    username: username,
    password: password
  })
  .then(user => {
    if (user) {
      res.send(`Logged in as ${user.username}`);
    } else {
      res.status(401).send('Invalid credentials');
    }
  })
  .catch(err => res.status(500).send('Error'));
});

// Web Interface
app.get('/', (req, res) => {
  res.send(`
    <h1>NoSQL Password Extraction Lab</h1>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <button>Login</button>
    </form>
  `);
});

app.listen(3000, () => {
  console.log('Lab running on http://localhost:3000');
});