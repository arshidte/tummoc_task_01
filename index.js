const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const configure = require('./passportConfig')

const User = require("./models/userModel");
const generateToken = require("./utils/generateToken");
const auth = require("./middlewares/authMiddleware");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
configure(passport);

// Start the application calling 'npm start'.
// The port of running is 5000.
// Call /register to register an user. Provide { username, email, password } as json through body.
// Call /login to login. From there, JWT token will be generated.
// Call /logout to logout. We are clearing the token when logging out.
// Used passport local strategy.

//Register API
app.post("/register", async (req, res) => {
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (err) throw err;
    if (user) res.send("User Already Exists");
    if (!user) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});

//Login API
app.post("/login", passport.authenticate("local"), (req, res) => {
  const token = generateToken(req.user._id)
  res.cookie("jwt", token);
  res.send(req.user);
});

app.get("/logout", auth, (req,res)=>{
  try {
    res.clearCookie('jwt');

    res.status(201).send("You are successfully logged out")
  } catch (error) {
    res.status(500).send(error)
  }
})

app.listen(5000, () => {
  console.log("Server is running in port 5000");
});
