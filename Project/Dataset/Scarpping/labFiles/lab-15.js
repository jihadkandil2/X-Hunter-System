const express = require('express');  
const mongoose = require('mongoose');  
const bodyParser = require('body-parser');  

const app = express();  
app.use(bodyParser.urlencoded({ extended: true }));  

// MongoDB connection  
mongoose.connect('mongodb://localhost:27017/nosql_lab', {  
  useNewUrlParser: true,  
  useUnifiedTopology: true  
});  

// User schema  
const UserSchema = new mongoose.Schema({  
  username: String,  
  password: String,  
  role: String  
});  
const User = mongoose.model('User', UserSchema);  

// Initialize DB  
async function initializeDB() {  
  await User.deleteMany({});  
  await User.create([  
    { username: 'carlos', password: 's3cr3t', role: 'user' },  
    { username: 'wiener', password: 'peter', role: 'user' }  
  ]);  
}  
initializeDB();  

// Vulnerable login endpoint  
app.post('/login', (req, res) => {  
  const { username, password } = req.body;  

  // Exploitable NoSQL query  
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

// Hidden debug endpoint  
app.get('/debug/users', async (req, res) => {  
  const users = await User.find({});  
  res.json(users);  
});  

// Frontend  
app.get('/', (req, res) => {  
  res.send(`  
    <h1>NoSQL Injection Lab</h1>  
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