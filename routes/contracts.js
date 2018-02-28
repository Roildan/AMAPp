const express = require("express"),
    router = express.Router();

const Contract = require("../models/contract"),
    User = require("../models/user"),
    Address = require("../models/address"),
    middleWare = require("../middleware");

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
    Address.find(function(err, addresses) {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "The address cannot be found\nAn error has occurred finding the address, please contact an admin for more info"
            );
            res.redirect("/contracts");
        }
        else {
            res.render("contracts/new", { addresses: addresses });
        }
    });
});

// CREATE ROUTE
router.post("/", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    const newContract = req.body.contract;
    newContract.producer = {
        id: req.user._id,
        username: req.user.username
    };

    Contract.create(newContract, function(err, contract) {
        if (err || !contract) {
            console.log(err);
            req.flash(
                "error",
                "The contract have fail to be created\nAn error has occurred during creation, please contact an admin for more info"
            );
        }
        else {
            // Add contract Id in created contract for the producer
            req.user.contract.created.push(contract._id);
            req.user.save();

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
    Contract
        .findById(req.params.id)
        .populate("delivery.address")
        .exec(function(err, contract) {
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
        if (err || !contract) {
            console.log(err);
            req.flash(
                "error",
                "This contract cannot be found\nAn error has occurred finding this contract, please contact an admin for more info"
            );
            res.redirect("/contracts");
        }
        else {
            Address.find(function(err, addresses) {
                if (err) {
                    console.log(err);
                    req.flash(
                        "error",
                        "The address cannot be found\nAn error has occurred finding the address, please contact an admin for more info"
                    );
                    res.redirect("/contracts");
                }
                else {
                    res.render("contracts/edit", { contract: contract, addresses: addresses });
                }
            });
        }
    });
});

// UPDATE ROUTE
router.put("/:id", middleWare.isLoggedIn, middleWare.checkContractOwnership, function(req, res) {
    const updatedContract = req.body.contract;
    Contract.findByIdAndUpdate(req.params.id, updatedContract, function(err, contract) {
        if (err || !contract) {
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
    Contract.findById(req.params.id, function(err, contract) {
        if (err || !contract) {
            console.log(err);
            req.flash(
                "error",
                "The contract have fail to be deleted\nAn error has occurred during deletion, please contact an admin for more info"
            );
            res.redirect("back");
        }
        else {
            // Remove this contract for all subcribed users
            for (let i = 0; i < contract.subscribedUsers; i++) {
                User.findById(contract.subscribedUsers[i], function(err, user) {
                    if (err || !user) {
                        console.log(err);
                    }
                    else {
                        for (let j = 0; j < user.contract.subscribed.length; j++) {
                            if (user.contract.subscribed[i].equals(req.params.id)) {
                                user.contract.subscribed.splice(i, 1);
                                break;
                            }
                        }
                        user.save();
                    }
                });
            }

            // Remove this contract in created contract for the producer
            User.findById(contract.producer.id, function(err, producer) {
                if (err || !producer) {
                    console.log(err);
                }
                else {
                    for (let i = 0; i < producer.contract.created; i++) {
                        if (producer.contract.created[i].equals(producer)) {
                            producer.contract.created.splice(i, 1);
                            break;
                        }
                    }
                    producer.save();
                }
            });

            // Remove the contract from database
            contract.remove();

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
        if (err || !contract) {
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
            req.user.contract.subscribed.push(contract._id);
            req.user.save();

            req.flash(
                "success",
                "Your subscription to this contract was successful !\nYou are now subscribed to " + contract.name
            );
            res.redirect("/contracts/" + req.params.id);
        }
    });
});

// UNSUBSCRIBING ROUTE
router.put("/:id/unsubscribe", middleWare.isLoggedIn, function(req, res) {
    Contract.findById(req.params.id, function(err, contract) {
        if (err || !contract) {
            console.log(err);
            req.flash(
                "error",
                "This contract cannot be found\nAn error has occurred finding this contract, please contact an admin for more info"
            );
            res.redirect("back");
        }
        else {
            for (let i = 0; i < contract.subscribedUsers.length; i++) {
                if (contract.subscribedUsers[i].equals(req.user._id)) {
                    contract.subscribedUsers.splice(i, 1);
                    break;
                }
            }
            contract.save();

            for (let i = 0; i < req.user.contract.subscribed.length; i++) {
                if (req.user.contract.subscribed[i].equals(contract.id)) {
                    req.user.contract.subscribed.splice(i, 1);
                    break;
                }
            }
            req.user.save();

            req.flash(
                "success",
                "Your unsubscription to this contract was successful !\nYou are no longer subscribed to " + contract.name
            );
            res.redirect("/contracts/" + req.params.id);
        }
    });
});



module.exports = router;
