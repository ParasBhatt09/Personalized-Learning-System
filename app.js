const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const session = require('express-session');   // ✅ Added for session management
const User = require('./models/user');

// ✅ Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/learnhub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ✅ Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Session Middleware
app.use(
  session({
    secret: 'learnhub-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Set EJS
app.set('view engine', 'ejs');

// ✅ ROUTES

// Home
app.get('/', (req, res) => {
  res.render('index.ejs', { name: req.session.user ? req.session.user.name : null });
});

// Signup page
app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

// Login page
app.get('/login', (req, res) => {
  res.render('login.ejs');
});

// ✅ Signup route
app.post('/user/signup', async (req, res) => {
  const { name, studentId, email, password } = req.body;
  try {
    const newUser = new User({ name, studentId, email, password });
    await newUser.save();
    console.log("User registered:", newUser.email);

    // Store in session
    req.session.user = newUser;

    return res.redirect('/course');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// ✅ Login route
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      console.log("Login successful");

      // Save user session
      req.session.user = user;
     res.render("index.ejs");
    } else {
      return res.status(400).send('Invalid email or password');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// ✅ Course selection page (only if logged in)
app.get("/course", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render("course.ejs", { email: req.session.user.email });
});

// ✅ Save selected subjects
app.post("/save-courses", async (req, res) => {
  const { email, subjects } = req.body;

  try {
    await User.findOneAndUpdate(
      { email },
      { $set: { subjects: Array.isArray(subjects) ? subjects : [subjects] } },
      { new: true }
    );

    console.log("Subjects saved for", email);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving subjects");
  }
});

// ✅ Logout route (optional)
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
