const express = require("express"),
    router = express.Router(),
    passport = require("passport");

const User = require("../models/user");

const tools = require("./tools");


router.get("/register", function(req, res) {
    res.render("authentication/register");
});

router.post("/register", function(req, res) {
    req.checkBody("username", "Username must contain only alphanumeric characters").isAlpha();
    req.checkBody("password", "Password must be at least 6 characters long").isLength({
        min: 6,
        max: 20
    });
    req.checkBody("email", "Enter a valid email address").isEmail();
    let inputErrors = req.validationErrors();
    if (inputErrors) {
        req.flash(
            "error",
            "Registration error\n" + tools.errorsToStr(inputErrors)
        );
        return res.redirect("/register");
    }

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
            req.flash(
                "error",
                "Registration error\n" + err.message
            );
            return res.redirect("/register");
        }

        passport.authenticate("local")(req, res, function() {
            req.flash(
                "success",
                "Welcome to AMApp " + user.username + "!\nYou can now enjoy all the features of AMApp"
            );
            res.redirect("/" + user.username + "/profile");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("authentication/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    successFlash: "Authentication successful !\nWe are please to see you back",
    failureRedirect: "/login",
    failureFlash: "Login error\nUsername or password incorrect"
}), function(req, res) {});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash(
        "success",
        "You're no longer connected !\nHave a nice day, we hope to see you soon"
    );
    res.redirect("/");
});

module.exports = router;
