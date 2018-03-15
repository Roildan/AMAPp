const express = require("express"),
    router = express.Router();

const User = require("../models/user"),
    Contract = require("../models/contract"),
    Address = require("../models/address"),
    middleWare = require("../middleware");

const tools = require("./tools");


// ADDRESS NEW ROUTE
router.get("/address/new", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    res.render("management/address/new");
});

// CREATE ROUTE
router.post("/address", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    req.checkBody("address[postalCode]", "Enter a valid postal code").isPostalCode("FR");
    let inputErrors = req.validationErrors();
    if (inputErrors) {
        req.flash(
            "error",
            "Address creating error\n" + tools.errorsToStr(inputErrors)
        );
        return res.redirect("/management/address/new");
    }

    const newAddress = req.body.address;
    newAddress.city = newAddress.city.toUpperCase();

    Address.create(newAddress, function(err, address) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "The address have fail to be created\nAn error has occurred during creation, please contact an admin for more info"
            );
        }
        else {
            req.flash(
                "success",
                "The address have been successfully created !\nFeel free to modify or delete it at any time if needed"
            );
        }
    });

    res.redirect("/management/address");
});

// ADDRESS INDEX ROUTE
router.get("/address", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    Address.find(function(err, addresses) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "Database error\nAn error has occurred finding all address, please contact an admin for more info, Wait... You're admin, well have fun debugging this ^^'"
            );
            return res.redirect("back");
        }
        res.render("management/address/index", { addresses: addresses });
    });
});

// ADDRESS EDIT ROUTE
router.get("/address/:id", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    Address.findById(req.params.id, function(err, address) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "This address cannot be found\nAn error has occurred finding this address, please contact an admin for more info"
            );
            res.redirect("/management/address");
        }
        else {
            res.render("management/address/edit", { address: address });
        }
    });
});

// ADDRESS UPDATE ROUTE
router.put("/address/:id", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    Address.findByIdAndUpdate(req.params.id, req.body.address, function(err, address) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "The address have fail to be updated\nAn error has occurred during update, please contact an admin for more info"
            );
            res.redirect("/management/address");
        }
        else {
            req.flash(
                "success",
                "The address have been successfully updated !\nFeel free to remodify or delete it at any time if needed"
            );
            res.redirect("/management/address");
        }
    });
});

// ADDRESS DELETE ROUTE
router.delete("/address/:id", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    Address.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "The address have fail to be deleted\nAn error has occurred during deletion, please contact an admin for more info"
            );
            res.redirect("back");
        }
        else {
            req.flash(
                "success",
                "The address have been successfully deleted !\nFeel free to create a new one to suit your need"
            );
            res.redirect("/management/address");
        }
    });
});

router.get("/contracts", middleWare.isLoggedIn, middleWare.isAdmin, function(req, res) {
    Contract.find(function(err, contracts) {
        if (err || !contracts) {
            console.log(err);
            req.flash(
                "error",
                "Database error\nAn error has occurred finding all contracts, please contact an admin for more info, Wait... You're admin, well have fun debugging this ^^'"
            );
            return res.redirect("back");
        }

        res.render("management/contracts", { contracts: contracts });
    });
});

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

module.exports = router;
