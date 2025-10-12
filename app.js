const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./models/user');

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/learnhub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index.ejs', { name: null }); // default view
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

// Signup
app.post('/user/signup', async (req, res) => {
  const { name, studentId, email, password } = req.body;
  try {
    const newUser = new User({ name, studentId, email, password });
    await newUser.save();
    console.log("Data saved");
    return res.render('index.ejs', { name: newUser.name });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// Login
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      console.log("Login successful");
      return res.render('index.ejs', { name: user.name });
    } else {
      return res.status(400).send('Invalid email or password');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
