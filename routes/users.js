const express = require("express"),
    router = express.Router(),
    passport = require("passport");

const User = require("../models/user"),
    middleWare = require("../middleware");


router.get("/register", function(req, res) {
    res.render("users/register");
});

router.post("/register", function(req, res) {
    req.checkBody("email", "Enter a valid email address").isEmail();
    let inputErrors = req.validationErrors();
    if (inputErrors) {
        let inputErrorsStr = "";
        for (let i = 0; i < inputErrors.length; i++) {
            inputErrorsStr += inputErrors[i].msg + " ";
        }
        req.flash(
            "error",
            "Registration error\n" + inputErrorsStr
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
                "Registration error\nAn error has occurred during your registration, please contact an admin for more info"
            );
            return res.redirect("/register");
        }

        passport.authenticate("local")(req, res, function() {
            req.flash(
                "success",
                "Welcome to AMApp " + user.username + "!\nYou can now enjoy all the features of AMApp"
            );
            res.redirect("/profile");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
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

router.get("/profile", middleWare.isLoggedIn, function(req, res) {
    User
        .findById(req.user._id)
        .populate("subscribedContracts", ["name"])
        .exec(function(err, user) {
            if (err || !user) {
                console.log(err);
                req.flash(
                    "error",
                    "You cannot be found\nAn error has occurred finding you, please contact an admin for more info"
                );
                return res.redirect("back");
            }
            res.render("users/profile", { user: user });
        });

});

router.get("/management", middleWare.isLoggedIn, middleWare.isAdmin, function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "Database error\nAn error has occurred finding all users, please contact an admin for more info, Wait... You're admin, well have fun debugging this ^^'"
            );
            return res.redirect("back");
        }
        res.render("users/management", { users: users });
    });
});

module.exports = router;
