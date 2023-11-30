var express = require('express');
var router = express.Router();
const passport = require('passport'); // Add this line
const userModel = require("./users");
const postModel = require("./posts");
const localStrategy = require("passport-local").Strategy; // Import the local strategy

// Initialize the local strategy
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.send("profile");
});

router.post("/register", (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password, function(err, user) {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }

    passport.authenticate("local")(req, res, function() {
      res.redirect("/profile");
    });
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}));

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
