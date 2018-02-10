const express = require("express"),
    router = express.Router(),
    passport = require("passport");

const Product = require("../models/product"),
    User = require("../models/user");


router.get("/", function(req, res) {
    res.render("home");
});

router.get("/bulk", function(req, res) {
    Product.find({}, function(err, products) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("bulk", { products: products });
        }
    });
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }

        passport.authenticate("local")(req, res, function() {
            res.redirect("/");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
