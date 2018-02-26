const express = require("express"),
    router = express.Router();

const User = require("../models/user"),
    middleWare = require("../middleware");

router.get("/users", middleWare.isLoggedIn, middleWare.isAdmin, function(req, res) {
    User.find(function(err, users) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "Database error\nAn error has occurred finding all users, please contact an admin for more info, Wait... You're admin, well have fun debugging this ^^'"
            );
            return res.redirect("back");
        }
        res.render("management/users", { users: users });
    });
});

router.get("/contracts", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    User
        .findById(req.user._id)
        .populate("contract.created", ["name"])
        .exec(function(err, user) {
            if (err || !user) {
                console.log(err);
                req.flash(
                    "error",
                    "You cannot be found\nAn error has occurred finding you, please contact an admin for more info"
                );
                return res.redirect("back");
            }
            res.render("management/contracts", { user: user });
        });
});

module.exports = router;
