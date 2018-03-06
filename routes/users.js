const express = require("express"),
    router = express.Router();

const User = require("../models/user"),
    Address = require("../models/address"),
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
        .exec(function(err, user) {
            if (err || !user) {
                console.log(err);
                req.flash(
                    "error",
                    "You cannot be found\nAn error has occurred finding you, please contact an admin for more info"
                );
                return res.redirect("back");
            }

            // Time of 1 week (in milliseconds)
            const weekTime = 1000 * 3600 * 24 * 7;

            const weeks = [
                [], // This week - 2
                [], // This week - 1
                [], // This week
                [], // This week + 1
                [], // This week + 2
            ];

            const maxPerWeek = [
                [], // This week - 2
                [], // This week - 1
                [], // This week
                [], // This week + 1
                [], // This week + 2
            ];

            for (let i = -2; i < 3; i++) {
                const weekDate = Date.now() + weekTime * i;
                // Represents the 7 days of the week
                const days = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                ];
                for (let contract of user.contract.subscribed) {
                    // Check whether the contract is active
                    if (contract.date.start > weekDate || contract.date.end < weekDate) {
                        continue;
                    }

                    // Check whether a delvery should be planned for this week
                    if (contract.delivery.frequency !== 1) {
                        const weekPassed = Math.floor((weekDate - contract.date.start) / weekTime);
                        if (weekPassed !== 0 && weekPassed % contract.delivery.frequency !== 0) {
                            continue;
                        }
                    }

                    // Order contracts in the corresponding day
                    switch (contract.delivery.dayOfWeek) {
                        case "Monday":
                            days[0].push(contract);
                            break;
                        case "Tuesday":
                            days[1].push(contract);
                            break;
                        case "Wednesday":
                            days[2].push(contract);
                            break;
                        case "Thursday":
                            days[3].push(contract);
                            break;
                        case "Friday":
                            days[4].push(contract);
                            break;
                        case "Saturday":
                            days[5].push(contract);
                            break;
                        case "Sunday":
                            days[6].push(contract);
                            break;
                    }
                }

                weeks[i + 2] = days;
                maxPerWeek[i + 2] = Math.max(...days.map(tab => tab.length));
            }

            res.render("users/planning", { weeks: weeks, maxPerWeek: maxPerWeek });
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
