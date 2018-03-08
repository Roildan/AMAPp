const express = require("express"),
    router = express.Router();

const User = require("../models/user"),
    middleWare = require("../middleware");

const tools = require("./tools");


router.get("/profile", middleWare.isLoggedIn, function(req, res) {
    res.render("users/profile");
});

router.get("/profile/edit", middleWare.isLoggedIn, function(req, res) {
    res.render("users/editProfile");
});

router.put("/profile", middleWare.isLoggedIn, function(req, res) {
    req.checkBody("email", "Enter a valid email address").isEmail();
    req.checkBody("contact[phone]", "Enter a valid phone number").isMobilePhone("fr-FR");
    req.checkBody("contact[postalCode]", "Enter a valid postal code").isPostalCode("FR");
    let inputErrors = req.validationErrors();
    if (inputErrors) {
        req.flash(
            "error",
            "Edit profile error\n" + tools.errorsToStr(inputErrors)
        );
        return res.redirect("/" + req.user.username + "/profile/edit");
    }

    const updatedUser = req.user;
    updatedUser.email = req.body.email;
    updatedUser.name = req.body.name;
    updatedUser.contact = req.body.contact;
    updatedUser.contact.city = updatedUser.contact.city.toUpperCase();

    User.findByIdAndUpdate(req.user._id, updatedUser, function(err, user) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "You cannot be found\nAn error has occurred finding you, please contact an admin for more info"
            );
            return res.redirect("back");
        }
        else {
            req.flash(
                "success",
                "Your profile have been successfully updated !\nPlease check if you haven't done any typo error"
            );
            res.redirect("/" + user.username + "/profile");
        }
    });
});

router.get("/settings", middleWare.isLoggedIn, function(req, res) {
    res.render("users/settings");
});

router.get("/my_contracts", middleWare.isLoggedIn, function(req, res) {
    User
        .findById(req.user._id)
        .populate("contract.subscribed", ["name"])
        .exec(function(err, user) {
            if (err || !user) {
                console.log(err);
                req.flash(
                    "error",
                    "You cannot be found\nAn error has occurred finding you, please contact an admin for more info"
                );
                return res.redirect("back");
            }
            res.render("users/myContracts", { user: user });
        });
});

router.get("/planning", middleWare.isLoggedIn, function(req, res) {
    User
        .findById(req.user._id)
        .populate("contract.subscribed")
        .populate("contract.created")
        .exec(function(err, user) {
            if (err || !user) {
                console.log(err);
                req.flash(
                    "error",
                    "You cannot be found\nAn error has occurred finding you, please contact an admin for more info"
                );
                return res.redirect("back");
            }

            // All the weeks that will be displayed
            // First one is subscribed, second one is created (if not empty)
            const weeks = [];
            weeks.push(tools.computeDelivery(user.contract.subscribed, 5));
            if (user.contract.created.length > 0) {
                weeks.push(tools.computeDelivery(user.contract.created, 5));
            }

            // Maximum contract in one day for each week
            // First one is subscribed, second one is created (if not empty)
            const maxPerDay = [
                [],
                []
            ];
            for (const week of weeks[0]) {
                maxPerDay[0].push(Math.max(...week.map(tab => tab.length)));
            }
            if (user.contract.created.length > 0) {
                for (const week of weeks[1]) {
                    maxPerDay[1].push(Math.max(...week.map(tab => tab.length)));
                }
            }

            res.render("users/planning", { weeks: weeks, maxPerDay: maxPerDay });
        });

    // USELESS ? (if only show links)
    // Manually populate address in subscribed contracts
    // Address.find(function(err, addresses) {
    //     if (err) {
    //         console.log(err);
    //         req.flash(
    //             "error",
    //             "This addresses cannot be found\nAn error has occurred finding the addresses, please contact an admin for more info"
    //         );
    //         return res.redirect("back");
    //     }
    // Find and save delivery address
    // for (let contract of user.contract.subscribed) {
    // for (let address of addresses) {
    //     if (contract.delivery.address.equals(address._id)) {
    //         contract.delivery.address = address;
    //         break;
    //     }
    // }
});


router.get("/management", middleWare.isLoggedIn, middleWare.isAdmin, function(req, res) {
    User.find(function(err, users) {
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
