const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
const port = 3000;
const User = require("./models/user");

mongoose.connect("mongodb://127.0.0.1:27017/learnhub")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "learnhub-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}
app.get("/", (req, res) => {
  res.render("index.html");
});
app.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/home");
  res.render("login");
});
app.get("/signup", (req, res) => {
  if (req.session.user) return res.redirect("/home");
  res.render("signup");
});
app.post("/signup", async (req, res) => {
  const { name, studentId, email, password } = req.body;
      
  try {
      const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).send("Email already registered!");
    }

    const existingStudentId = await User.findOne({ studentId });
    if (existingStudentId) {
      return res.status(400).send("Student ID already registered!");
    }
    const user = new User({ name, studentId, email, password });
    await user.save();

    req.session.user = user;
    res.redirect("/home");
  } catch (err) {
    console.log(err);
    res.status(500).send("Signup failed");
  }
});
 
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.send("Invalid Email or Password");
    }

    req.session.user = user;
    res.redirect("/home");
  } catch (err) {
    console.log(err);
    res.status(500).send("Login failed");
  }
});
app.get("/learn", requireLogin, (req, res) => {
  if(!req.session.user) {
    return res.redirect('/login');
  }
  res.send(" Page - Under Construction");
});
app.get("/home", requireLogin, (req, res) => {
  res.render("index", { user: req.session.user });
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
app.get("/course", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
 const gradeRange = req.query.gradeRange;
  res.render("course", { gradeRange });
});
app.post("/save-courses", async (req, res) => {
  const { subjects, gradeRange, classNumber } = req.body;
  const email = req.session.user.email; 

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          subjects: Array.isArray(subjects) ? subjects : [subjects],
          classNumber: classNumber,
          gradeRange: gradeRange
        }
      },
      { new: true }
    );

    req.session.user = updatedUser; 

    res.redirect("/home");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving courses");
  }
});
 app.get("/subject", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  } 
  res.render("subject", {
    user: req.session.user,
    subjects: req.session.user.subjects || []
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
