const express = require("express"),
    router = express.Router(),
    passport = require("passport");

const User = require("../models/user"),
    middleWare = require("../middleware");


router.get("/register", function(req, res) {
    res.render("users/register");
});

router.post("/register", function(req, res) {
    req.checkBody("email", "Enter a valid email address.").isEmail();
    let inputErrors = req.validationErrors();
    if (inputErrors) {
        console.log(inputErrors);
        return res.render("users/register");
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

router.get("/profile", middleWare.isLoggedIn, function(req, res) {
    User
        .findById(req.user._id)
        .populate("subscribedContracts", ["name"])
        .exec(function(err, user) {
            if (err || !user) {
                console.log(err);
                return res.redirect("back");
            }
            res.render("users/profile", { user: user });
        });

});

module.exports = router;
