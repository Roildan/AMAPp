const express = require("express"),
    router = express.Router();

const Contract = require("../models/contract"),
    middleWare = require("../middleware")

// INDEX ROUTE
router.get("/", function(req, res) {
    Contract.find({}, function(err, contracts) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("contracts/index", { contracts: contracts });
        }
    });
});

// NEW ROUTE
router.get("/new", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    res.render("contracts/new");
});

// CREATE ROUTE
router.post("/", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    const newContract = req.body.contract;
    newContract.producer = {
        id: req.user._id,
        username: req.user.username
    };

    Contract.create(newContract, function(err, contract) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "The contract have fail to be created\nAn error has occurred during creation, please contact an admin for more info"
            );
        }
        else {
            req.flash(
                "success",
                "The contract have been successfully created !\nFeel free to modify or delete it at any time if needed"
            );
        }
    });

    res.redirect("/contracts");
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
    Contract.findById(req.params.id, function(err, contract) {
        if (err || !contract) {
            console.log(err);
            req.flash(
                "error",
                "This contract cannot be found\nAn error has occurred finding this contract, please contact an admin for more info"
            );
            return res.redirect('/contracts');
        }
        res.render("contracts/show", { contract: contract });
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleWare.isLoggedIn, middleWare.checkContractOwnership, function(req, res) {
    Contract.findById(req.params.id, function(err, contract) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "This contract cannot be found\nAn error has occurred finding this contract, please contact an admin for more info"
            );
            res.redirect("/contracts");
        }
        else {
            res.render("contracts/edit", { contract: contract });
        }
    });
});

// UPDATE ROUTE
router.put("/:id", middleWare.isLoggedIn, middleWare.checkContractOwnership, function(req, res) {
    Contract.findByIdAndUpdate(req.params.id, req.body.contract, function(err, contract) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "The contract have fail to be updated\nAn error has occurred during update, please contact an admin for more info"
            );
            res.redirect("/contracts");
        }
        else {
            req.flash(
                "success",
                "The contract have been successfully updated !\nFeel free to remodify or delete it at any time if needed"
            );
            res.redirect("/contracts/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete("/:id", middleWare.isLoggedIn, middleWare.checkContractOwnership, function(req, res) {
    Contract.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "The contract have fail to be deleted\nAn error has occurred during deletion, please contact an admin for more info"
            );
            res.redirect("back");
        }
        else {
            req.flash(
                "success",
                "The contract have been successfully deleted !\nFeel free to create a new one to suit your need"
            );
            res.redirect("/contracts");
        }
    });
});

// SUBSCRIBING ROUTE
router.put("/:id/subscribe", middleWare.isLoggedIn, function(req, res) {
    Contract.findById(req.params.id, function(err, contract) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "This contract cannot be found\nAn error has occurred finding this contract, please contact an admin for more info"
            );
            res.redirect("back");
        }
        else {
            // Check disponibility
            if (contract.disponibility < contract.subscribedUsers.length) {
                req.flash(
                    "error",
                    "You cannot subscribe to this contract\nThis contract has reached his maximun capacity, the producer cannot provide more of it"
                );
                return res.redirect("back");
            }

            // Check if not already subscribed
            for (let i = 0; i < contract.subscribedUsers.length; i++) {
                if (contract.subscribedUsers[i].equals(req.user._id)) {
                    req.flash(
                        "error",
                        "You cannot subscribe to this contract\nYou are already subscribed to this contract"
                    );
                    return res.redirect("back");
                }
            }

            contract.subscribedUsers.push(req.user._id);
            contract.save();
            req.user.subscribedContracts.push(contract._id);
            req.user.save();

            req.flash(
                "success",
                "Your subscription to this contract was successful !\nYou are now subscribed to " + contract.name
            );
            res.redirect("/contracts/" + req.params.id);
        }
    });
});



module.exports = router;
