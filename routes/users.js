const express = require("express"),
    router = express.Router(),
    passport = require("passport");

const User = require("../models/user");


router.get("/register", function(req, res) {
    res.render("users/register");
});

router.post("/register", function(req, res) {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email
    });
    if (req.body.privilege === "admin") {
        newUser.isAdmin = true;
    }
    else if (req.body.privilege === "producer") {
        newUser.isProducer = true;
    }

    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("users/register");
        }

        passport.authenticate("local")(req, res, function() {
            res.redirect("/");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

router.get("/profile", function(req, res) {
    res.render("users/profile");
});

module.exports = router;
